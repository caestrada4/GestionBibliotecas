import axios from "axios";

const createLoanSOAP = async (userId, bookId, loanDate, returnDate) => {
  const url = "http://localhost:3000/loanService";
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
  };

  const xml = `
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
    const response = await axios.post(url, xml, { headers });
    console.log("SOAP Response:", response.data);
  } catch (error) {
    console.error("Error al crear préstamo con SOAP:", error);
  }
};

export default createLoanSOAP;
