import { API_PARAMS, MAX_RETRY, SF_UUID } from "~/constants/string";
import { adminUpdateUserAttributes, getCognitoUserDetails } from "./authentication.server";
import { getAccessToken, getNewAccessToken } from "./sf-auth.server";
import { Session } from "@remix-run/node";
import axios, { AxiosError } from "axios";
import { v4 } from 'uuid';
import { DBHandler } from "./db.server";

const BASE_URL = process.env.SF_BASE_URL;

const createSFUser = async (session:Session, userDetails:Object, sfUUID:string, accessToken:string, numRetries:number = 0) => {
    try {
        const payload = {
            email: userDetails.email,
            uuid: sfUUID
        }
        const apiUrl = BASE_URL + API_PARAMS + "/customer-account"
        const headers = {
            "Content-Type": "application/json",
            "User-Agent": "Solvefins-Cylo-BP/1.0",
            Authorization: "Bearer " + accessToken || "",
        };
        const createUserResponse = await axios.post(apiUrl, payload, { headers });
        return createUserResponse;
    } catch(error){
        console.error(error);
        if ( error instanceof AxiosError){
			if (numRetries >= MAX_RETRY)
				throw Error("Internal Server Error");
			return await createSFUser(session, userDetails, sfUUID, await getNewAccessToken(), numRetries + 1);
		}
		else
			throw error;
    }
}

export const createSFUserHandler =  async(session:Session, userDetails: Object) => {
    try {
        let sfUUID = v4();
        const createSFUserResponse = await createSFUser(session, userDetails, sfUUID, await getAccessToken());
        await adminUpdateUserAttributes(session, [
            {
                Name: "email_verified",
                Value: String(true)
            },
            {
                Name: SF_UUID,
                Value: sfUUID
            }
        ]);
        let dbHandler = await DBHandler.getConnection();
        await dbHandler.updateClientUserId(session.get("sessionId"), sfUUID);
        await dbHandler.closeConnection();
    } catch (error) {
        console.error(error);
        return {
            status: {
                statusCode: 500,
                message: "Error",
                description: "Internal Server Error",
            },
            data: {}
        }
    }
}