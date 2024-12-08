import axios from 'axios';

export const createLoanSOAP = async (userId, bookId, loanDate, returnDate) => {
  const xmlRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/LoanService/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:CreateLoan>
          <userId>${userId}</userId>
          <bookId>${bookId}</bookId>
          <loanDate>${loanDate}</loanDate>
          <returnDate>${returnDate}</returnDate>
        </tns:CreateLoan>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await axios.post(
      'http://localhost:3000/loanService',
      xmlRequest,
      { headers: { 'Content-Type': 'text/xml' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error in SOAP request:', error);
    throw error;
  }
};
