import React from 'react';

const startupData = [
  {
    name: "BON V Aero",
    website: "bonvaero.com",
    industry: "Aerospace",
    country: "India",
    fundingAmount: 1155117,
    fundingType: "Seed",
    lastFundingDate: "Feb 2025"
  },
  {
    name: "Whizzo",
    website: "whizzo.org",
    industry: "Artificial Intelligence",
    country: "India",
    fundingAmount: 4200000,
    fundingType: "Seed",
    lastFundingDate: "Feb 2025"
  },
  // ... Add all other startups here
];

function StartupFunding() {
  const formatFunding = (amount) => {
    if (!amount) return "Undisclosed";
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Recently Funded Startups</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startupData.map((startup, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{startup.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  startup.fundingType === 'Seed' ? 'bg-green-100 text-green-800' :
                  startup.fundingType === 'Series A' ? 'bg-blue-100 text-blue-800' :
                  startup.fundingType === 'Pre-Seed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {startup.fundingType}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Industry:</span> {startup.industry}
                </p>
                <a 
                  href={`https://${startup.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  {startup.website}
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Funding Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatFunding(startup.fundingAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Funding Date</p>
                    <p className="text-gray-900">{startup.lastFundingDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StartupFunding; 