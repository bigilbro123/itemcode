import { useState } from 'react';
// import QRScanner from 'react-qr-scanner';
import './Job.css';

function Home() {
    const [response, setResponse] = useState(null);
    const [filteredResponse, setFilteredResponse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemCode, setItemCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);  // State for QR scanner visibility
    const itemsPerPage = 5;
    const [showall, setShowall] = useState(false)


    const handleSubmit = async (event) => {
        setShowall(true)
        event.preventDefault();

        const locationID = JSON.parse(localStorage.getItem('user')).locCode;

        const url = `http://15.207.90.158:5000/api/ItemSearch/GetItemSearch?ItemCode=${encodeURIComponent(itemCode)}&LocationID=${locationID}`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            setResponse(result.dataSet.data);

            if (startDate && endDate) {
                const filteredData = result.dataSet.data.filter(item => {
                    const bookingDate = new Date(item.bookingDate);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return bookingDate >= start && bookingDate <= end;
                });
                setFilteredResponse(filteredData);
            } else {
                setFilteredResponse(result.dataSet.data);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            setResponse({ error: 'Failed to fetch report' });
        }
    };

    const showAll = () => {
        setShowall(false)
        setFilteredResponse(response);

        setCurrentPage(1);
    };

    // const handleScan = (data) => {
    //     if (data) {
    //         setItemCode(data.text);  // Set the scanned QR code as item code
    //         setIsQRScannerVisible(false);  // Hide the QR scanner
    //     }
    // };

    // const handleError = (err) => {
    //     console.error(err);
    // };

    const handleClear = () => {
        setItemCode('');
        setStartDate('');
        setEndDate('');
        setFilteredResponse(null);
        setResponse(null);
        setCurrentPage(1);
        // setIsQRScannerVisible(false);  // Hide the QR scanner if it's visible
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredResponse?.slice(indexOfFirstItem, indexOfLastItem) || [];

    const totalPages = Math.ceil(filteredResponse?.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
            <div id='outerdiv' style={{
                width: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', backgroundColor: 'white'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h1>Rootments</h1>
                    </div>

                    {/* Input for Item Code */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="itemCode" style={{ display: 'block', fontWeight: 'bold' }}>Item Code:</label>
                        <input
                            type="text"
                            id="itemCode"
                            value={itemCode}
                            onChange={(e) => setItemCode(e.target.value)}
                            placeholder="Enter Item Code"
                            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                            required
                        />
                    </div>

                    {/* QR Scanner */}
                    {/* {isQRScannerVisible && (
                        <div style={{ marginBottom: '20px' }}>
                            <QRScanner
                                delay={300}
                                onScan={handleScan}
                                onError={handleError}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <button
                                type="button"
                                onClick={() => setIsQRScannerVisible(false)}
                                style={{
                                    display: 'block', width: '100%', marginTop: '10px', padding: '10px',
                                    backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer'
                                }}
                            >
                                Close Scanner
                            </button>
                        </div>
                    )} */}

                    {/* Date range inputs */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="startDate" style={{ display: 'block', fontWeight: 'bold' }}>Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="endDate" style={{ display: 'block', fontWeight: 'bold' }}>End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                        />
                    </div>

                    <div style={{ display: 'flex ', gap: '10px' }}>
                        {startDate && endDate ? (
                            !response ? (
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    style={{ width: '100%', marginTop: '20px' }}
                                >
                                    Submit
                                </button>
                            ) : (
                                showall ? (
                                    <div style={{ width: '100%', marginTop: '20px' }}>
                                        <button
                                            className="btn btn-info"
                                            onClick={showAll}
                                            style={{ width: '100%' }}
                                        >
                                            Show All
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        style={{ width: '100%', marginTop: '20px' }}
                                    >
                                        Get Specified Data
                                    </button>
                                )
                            )
                        ) : (
                            <h2
                                className="btn btn-block"
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px',
                                    height: '40px',
                                    fontSize: '20px',
                                }}
                            >
                                Enter Dates
                            </h2>
                        )}


                        {/* Clear button */}
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn btn-warning btn-block" style={{ width: '100%', marginTop: '20px' }}
                        >
                            Clear
                        </button>

                    </div>
                </form>

                {/* Show All button */}
                {/* {response && } */}

                {
                    filteredResponse && (
                        <div style={{
                            marginTop: '20px', overflowX: 'auto', textAlign: 'center',
                        }}>
                            <table className="table table-responsive table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Booking Date</th>
                                        <th>Delivery Date</th>
                                        <th>Return Date</th>
                                        <th>Customer Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{new Date(item.bookingDate).toLocaleDateString()}</td>
                                            <td>{item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A'}</td>
                                            <td>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A'}</td>
                                            <td>{item.customerName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button className='btn btn-primary'
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                >
                                    First
                                </button>
                                <button className='btn btn-primary'
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <span style={{ margin: '0 10px' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button className='btn btn-primary'
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                                <button className='btn btn-primary'
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
}

export default Home;
