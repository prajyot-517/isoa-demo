import { useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";

const PlanCard = ({ plan }) => {
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();
  const submit = useSubmit();

  const toggleExpanded = (planType: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [planType]: !prev[planType],
    }));
  };

  const handleBuyNow = () => {
    navigate("/payment-details", {
      state: {
        price: plan?.price,
        quote_id_for_bind: plan?.quote_id_for_bind,
        quote_option_id_for_bind: plan?.quote_option_id_for_bind,
        policy_id: plan?.policy_id,
      },
    });
  };

  const isExpanded = expandedCards[plan.id];
  const visibleFeatures = plan?.features.filter((f) => f.visible);
  const hiddenFeatures = plan?.features.filter((f) => !f.visible);
  const hasHiddenFeatures = hiddenFeatures.length > 0;

  return (
    <div className="relative w-80 rounded-lg border shadow-lg overflow-hidden bg-white">
      <div
        className={`h-2 w-full ${
          plan.name === "Secure"
            ? "bg-gradient-to-r from-blue-500 to-blue-200"
            : plan.name === "Compass"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-200"
            : "bg-gradient-to-r from-gray-400 to-gray-200"
        }`}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {plan.name}
        </h3>
        <div className="mb-4 flex items-end space-x-1">
          <span
            className={`text-3xl font-bold ${
              plan.id === "secure"
                ? "text-blue-600"
                : plan.id === "compass"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {plan.price}
          </span>
          <span className="text-gray-600 text-sm">{plan.priceNote}</span>
        </div>
        <button
          className="w-full bg-[#800032] hover:bg-[#660028] text-white py-3 px-4 rounded-lg font-semibold mb-6"
          onClick={handleBuyNow}
        >
          Buy now
        </button>
        <div className="space-y-3">
          {visibleFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <svg
                className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="flex-1">
                <div className="text-gray-800 text-sm">{feature.text}</div>
                {feature.value && (
                  <div className="font-semibold text-gray-900">
                    {feature.value}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isExpanded &&
            hiddenFeatures.map((feature, index) => (
              <div
                key={`hidden-${index}`}
                className="flex items-start space-x-3"
              >
                <svg
                  className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="flex-1">
                  <div className="text-gray-800 text-sm">{feature.text}</div>
                  {feature.value && (
                    <div className="font-semibold text-gray-900">
                      {feature.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        {hasHiddenFeatures && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => toggleExpanded(plan.id)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              <span>{isExpanded ? "View less" : "View more"}</span>
              {isExpanded ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
