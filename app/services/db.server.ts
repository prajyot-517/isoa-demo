import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import * as path from 'path';
import { decryptSymmetric, encryptSymmetric } from "./encryption.server";

const DB_LOCATION = "database/portal-db.db"
const ENCRYPTION_KEY = process.env.ACCESS_TOKEN_ENCRYPTION_KEY

export class DBHandler {
  dbConnection: Database;

  constructor(dbConnection: Database) {
    this.dbConnection = dbConnection;
  }

  static async getConnection() {
    const dbConnection = await open({
      filename: path.resolve(process.cwd(), DB_LOCATION),
      driver: sqlite3.Database,
    });
    return new DBHandler(dbConnection);
  }

  getServerToken = async () => {
    const result = await this.dbConnection.get(
      "SELECT ACCESS_TOKEN, IV FROM SERVER_SESSION"
    );
    let accessToken;
    if (result)
      accessToken = decryptSymmetric(ENCRYPTION_KEY, result.ACCESS_TOKEN, result.IV);
    return accessToken;
  };

  updateServerToken = async (accessToken: string) => {
    await this.dbConnection.run("DELETE FROM SERVER_SESSION");
    const {ciphertext, iv} = encryptSymmetric(ENCRYPTION_KEY, accessToken); 
    await this.dbConnection.run(
      "INSERT INTO SERVER_SESSION (ACCESS_TOKEN, IV) VALUES(?, ?)",
      [ciphertext, iv]
    );
  };

  getClientAccessToken = async (sessionId: string) => {
    const result = await this.dbConnection.get(
      "SELECT ACCESS_TOKEN, IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    let currentTimestamp = Date.now();
    await this.dbConnection.run(
      "UPDATE CLIENT_SESSION SET LAST_ACCESS_TIME = ? WHERE SESSION_ID = ?",
      [currentTimestamp, sessionId]
    );
    let accessToken;
    if(result)
      accessToken = decryptSymmetric(ENCRYPTION_KEY, result.ACCESS_TOKEN, result.IV);
    return accessToken;
  };

  getClientUserId = async (sessionId: string) => {
    const result = await this.dbConnection.get(
      "SELECT USER_ID, IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    let userId;
    if(result)
      userId = decryptSymmetric(ENCRYPTION_KEY, result.USER_ID, result.IV);
    return userId;
  };

  getClientRefreshToken = async (sessionId: string) => {
    const result = await this.dbConnection.get(
      "SELECT REFRESH_TOKEN, IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    let refreshToken;
    if(result)
      refreshToken = decryptSymmetric(ENCRYPTION_KEY, result.REFRESH_TOKEN, result.IV);
    return refreshToken;
  };

  getUserId = async (sessionId: string) => {
    const result = await this.dbConnection.get(
      "SELECT USER_ID, IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    let userId;
    if (result)
      userId = decryptSymmetric(ENCRYPTION_KEY, result.USER_ID, result.IV);
    return userId;
  };

  addClientSessionRecord = async (
    sessionId: string,
    accessToken: string,
    idToken: string,
    refreshToken: string,
    userId: string
  ) => {
    let currentTimestamp = Date.now();
    const encryptionResult = encryptSymmetric(ENCRYPTION_KEY, accessToken); 
    const iv = encryptionResult?.iv;
    const encryptedData = {
      accessToken: encryptionResult?.ciphertext,
      idToken: encryptSymmetric(ENCRYPTION_KEY, idToken, iv)?.ciphertext,
      refreshToken: encryptSymmetric(ENCRYPTION_KEY, refreshToken, iv)?.ciphertext,
      userId: encryptSymmetric(ENCRYPTION_KEY, userId, iv)?.ciphertext
    }
    await this.dbConnection.run(
      "INSERT INTO CLIENT_SESSION (SESSION_ID, ACCESS_TOKEN, ID_TOKEN, REFRESH_TOKEN, USER_ID, LAST_ACCESS_TIME, IV) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [sessionId, encryptedData.accessToken, encryptedData.idToken, encryptedData.refreshToken, encryptedData.userId, currentTimestamp, iv]
    );
  };

  updateClientSessionTokens = async (
    sessionId: string,
    accessToken: string,
    idToken: string, 
    userId: string
  ) => {
    const { IV } = await this.dbConnection.get(
      "SELECT IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    const encryptedData = {
      accessToken: encryptSymmetric(ENCRYPTION_KEY, accessToken, IV)?.ciphertext,
      idToken: encryptSymmetric(ENCRYPTION_KEY, idToken, IV)?.ciphertext,
      userId: encryptSymmetric(ENCRYPTION_KEY, userId, IV)?.ciphertext
    }
    await this.dbConnection.run(
      `UPDATE CLIENT_SESSION 
      SET ACCESS_TOKEN = ?,
          ID_TOKEN = ?,
          USER_ID = ?
      WHERE SESSION_ID = ?`,
      [encryptedData.accessToken, encryptedData.idToken, encryptedData.userId, sessionId]
    );
  };

  updateClientAccessToken = async (
    sessionId: string,
    accessToken: string
  ) => {
    const row = await this.dbConnection.get(
      "SELECT IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    if(!row)
      return "INVALID_SESSION_ID";
    const IV = row?.IV;
    const encryptedData = {
      accessToken: encryptSymmetric(ENCRYPTION_KEY, accessToken, IV)?.ciphertext
    }
    await this.dbConnection.run(
      `UPDATE CLIENT_SESSION 
      SET ACCESS_TOKEN = ?
      WHERE SESSION_ID = ?`,
      [encryptedData.accessToken, sessionId]
    );
  };

  updateClientUserId = async (
    sessionId: string,
    userId: string
  ) => {
    const { IV } = await this.dbConnection.get(
      "SELECT IV FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
    const encryptedData = {
      userId: encryptSymmetric(ENCRYPTION_KEY, userId, IV)?.ciphertext
    }
    await this.dbConnection.run(
      `UPDATE CLIENT_SESSION 
      SET USER_ID = ?
      WHERE SESSION_ID = ?`,
      [encryptedData.userId, sessionId]
    );
  };

  deleteClientSession = async (sessionId: string) => {
    await this.dbConnection.run(
      "DELETE FROM CLIENT_SESSION WHERE SESSION_ID = ?",
      [sessionId]
    );
  };

  closeConnection = async () => {
    await this.dbConnection.close();
  }
}
