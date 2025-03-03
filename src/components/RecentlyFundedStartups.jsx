import React, { useEffect, useState } from "react";
import startupData from '../startup-aus.json';

const RecentlyFundedStartups = () => {
    const [startups, setStartups] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalStartups = startupData ? startupData.length : 0;
    const totalPages = Math.ceil(totalStartups / itemsPerPage);

    useEffect(() => {
        // Filter all valid startups with funding amounts
        const filteredData = startupData
            .filter((startup) => startup["Funding Amount (USD)"] !== "")
            .sort(
                (a, b) =>
                    new Date(b["Last Funding Date"]) - new Date(a["Last Funding Date"])
            );

        // Calculate the start and end indices for the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Get the startups for the current page
        const paginatedStartups = filteredData.slice(startIndex, endIndex);

        setStartups(paginatedStartups);
        setLoading(false);
    }, [currentPage]); // Re-run when currentPage changes

    const filteredResults = startups.filter((startup) =>
        startup.Name.toLowerCase().includes(search.toLowerCase())
    );

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Optional: Scroll to top when page changes
        window.scrollTo(0, 0);
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 5; // Show at most 5 page buttons at a time

        // Calculate the range of buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

        // Adjust the start if we're near the end
        if (endPage - startPage + 1 < maxButtonsToShow) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                &laquo;
            </button>
        );

        // First page button if not starting from page 1
        if (startPage > 1) {
            buttons.push(
                <button
                    key="1"
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 mx-1 rounded hover:bg-gray-300"
                >
                    1
                </button>
            );

            // Add ellipsis if there's a gap
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-2 py-2">
                        ...
                    </span>
                );
            }
        }

        // Page buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded ${currentPage === i
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-2 py-2">
                        ...
                    </span>
                );
            }

            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 mx-1 rounded hover:bg-gray-300"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                &raquo;
            </button>
        );

        return buttons;
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Recent Startup Investments</h1>
            <p className="mb-6 text-gray-600">Track and filter your recently funded startups and apply for jobs</p>

            <div className="flex justify-between mb-6">
                <input
                    type="text"
                    placeholder="Search startups..."
                    className="border border-gray-300 rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search startups"
                />
                <div className="ml-4">
                    <select className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Industry</option>
                        {/* Add industry options here */}
                    </select>
                    <select className="ml-4 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Country</option>
                        {/* Add country options here */}
                    </select>
                    <select className="ml-4 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Funding Type</option>
                        {/* Add funding type options here */}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResults.map((startup, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl startup-box transition-shadow duration-300"
                            >
                                <div>
                                    <div className="name-logo flex-row">
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=https://${startup.Website}`}
                                            alt={`${startup.Name} logo`}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <h3 className="text-xl font-semibold text-gray-900">{startup.Name}</h3>
                                    </div>

                                    <div className="industry-box">
                                        {startup.Industry &&
                                            startup.Industry.split(',').map((name, i) => {
                                                const randomIndex = Math.floor(Math.random() * 11) + 1; // Generate random number inside map
                                                return (
                                                    <p key={i} className={`text-gray-600 text-[12px] industry-item industry-${randomIndex}`}>

                                                        {name.trim()}
                                                    </p>
                                                );
                                            })}
                                    </div>

                                    <p className="mt-2 text-gray-600">
                                        <a
                                            href={`https://${startup.Website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-800 text-[14px] "
                                        >
                                            🔗
                                            {startup.Website}
                                        </a>
                                    </p>

                                    <p className="text-gray-700">🏢 {startup["Country"]}</p>
                                    <p className="text-gray-700">{startup["Last Funding Date"]}</p>
                                </div>
                                <div className="mt-4">
                                    <span className="line"></span>
                                    <p className="text-gray-900 font-bold">
                                        ${startup["Funding Amount (USD)"].slice(1)}
                                        <span className="mx-2 font-light">|</span>
                                        <span className="font-light my-4">    {startup["Funding Type"]}</span>
                                    </p>
                                    <div className="startup-item__cta">

                                        <a  href={`https://${startup.Website}/careers`} className="text-sm startup-item-btn">
                                            Visit Careers Page{" "}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0,0,256,256"
                                                className="inline-block ml-1"
                                            >
                                                <g
                                                    fill="#ffffff"
                                                    fillRule="nonzero"
                                                    stroke="none"
                                                    strokeWidth="2"
                                                    strokeLinecap="butt"
                                                    strokeLinejoin="miter"
                                                    strokeMiterlimit="10"
                                                    strokeDasharray=""
                                                    strokeDashoffset="0"
                                                    fontFamily="none"
                                                    fontWeight="none"
                                                    fontSize="none"
                                                    textAnchor="none"
                                                    style={{ mixBlendMode: "normal" }}
                                                >
                                                    <g transform="scale(8.53333,8.53333)">
                                                        <path d="M25.98047,2.99023c-0.03726,0.00118 -0.07443,0.00444 -0.11133,0.00977h-5.86914c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h3.58594l-10.29297,10.29297c-0.26124,0.25082 -0.36648,0.62327 -0.27512,0.97371c0.09136,0.35044 0.36503,0.62411 0.71547,0.71547c0.35044,0.09136 0.72289,-0.01388 0.97371,-0.27512l10.29297,-10.29297v3.58594c-0.0051,0.36064 0.18438,0.69608 0.49587,0.87789c0.3115,0.18181 0.69676,0.18181 1.00825,0c0.3115,-0.18181 0.50097,-0.51725 0.49587,-0.87789v-5.87305c0.04031,-0.29141 -0.04973,-0.58579 -0.24615,-0.80479c-0.19643,-0.219 -0.47931,-0.34042 -0.77338,-0.33192zM6,7c-1.09306,0 -2,0.90694 -2,2v15c0,1.09306 0.90694,2 2,2h15c1.09306,0 2,-0.90694 2,-2v-10v-2.57812l-2,2v2.57813v8h-15v-15h8h2h0.57813l2,-2h-2.57812h-2z"></path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="mt-8 flex justify-center">
                        <div className="pagination-container">
                            {renderPaginationButtons()}
                        </div>
                    </div>

                    {/* Page info */}
                    <div className="mt-4 text-center text-gray-600">
                        Page {currentPage} of {totalPages} |
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, totalStartups)} of {totalStartups} startups
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentlyFundedStartups;