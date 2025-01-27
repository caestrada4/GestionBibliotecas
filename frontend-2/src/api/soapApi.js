import axios from "axios";

const SOAP_URL = "https://azure-library-project-back-faccasd8b3eueycs.eastus2-01.azurewebsites.net/loanService";

// Obtener el token almacenado en el localStorage
const getAuthToken = () => localStorage.getItem("token");

// Obtener encabezados con autenticación
const headers = () => ({
  "Content-Type": "text/xml;charset=UTF-8",
  Authorization: `Bearer ${getAuthToken()}`,
});

/**
 * Obtener historial de préstamos de un usuario
 * @param {number} userId
 */
export const getUserLoanHistorySOAP = async (userId) => {
  const xml = `
    <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://example.com/LoanService/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:GetUserLoanHistory>
          <userId>${userId}</userId>
        </tns:GetUserLoanHistory>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    console.log("SOAP Request (GetUserLoanHistory):", xml);
    const response = await axios.post(SOAP_URL, xml, { headers: headers() });
    console.log("SOAP Response (GetUserLoanHistory):", response.data);
    return parseSOAPResponse(response.data, "GetUserLoanHistoryResponse");
  } catch (error) {
    handleSOAPError("GetUserLoanHistory", error);
    throw error;
  }
};

/**
 * Crear un préstamo
 * @param {number} userId
 * @param {number} bookId
 * @param {string} loanDate
 * @param {string} returnDate
 */
export const createLoanSOAP = async (userId, bookId, loanDate, returnDate) => {
  const xml = `
    <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://example.com/LoanService/">
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
    console.log("SOAP Request (CreateLoan):", xml);
    const response = await axios.post(SOAP_URL, xml, { headers: headers() });
    console.log("SOAP Response (CreateLoan):", response.data);
    return parseSOAPResponse(response.data, "CreateLoanResponse");
  } catch (error) {
    handleSOAPError("CreateLoan", error);
    throw error;
  }
};

/**
 * Registrar devolución de un préstamo
 * @param {number} loanId
 */
export const returnLoanSOAP = async (loanId) => {
  const xml = `
    <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://example.com/LoanService/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ReturnLoan>
          <loanId>${loanId}</loanId>
        </tns:ReturnLoan>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    console.log("SOAP Request (ReturnLoan):", xml);
    const response = await axios.post(SOAP_URL, xml, { headers: headers() });
    console.log("SOAP Response (ReturnLoan):", response.data);
    return parseSOAPResponse(response.data, "ReturnLoanResponse");
  } catch (error) {
    handleSOAPError("ReturnLoan", error);
    throw error;
  }
};

/**
 * Obtener préstamos activos
 */
export const getActiveLoansSOAP = async () => {
  const xml = `
    <soapenv:Envelope xmlns:soapenv="https://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://example.com/LoanService/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:GetActiveLoans/>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    console.log("SOAP Request (GetActiveLoans):", xml);
    const response = await axios.post(SOAP_URL, xml, { headers: headers() });
    console.log("SOAP Response (GetActiveLoans):", response.data);
    return parseSOAPResponse(response.data, "GetActiveLoansResponse");
  } catch (error) {
    handleSOAPError("GetActiveLoans", error);
    throw error;
  }
};

/**
 * Parsear una respuesta SOAP para obtener datos relevantes
 * @param {string} xml
 * @param {string} responseTag
 */
const parseSOAPResponse = (xml, responseTag) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const result = xmlDoc.getElementsByTagName(responseTag)[0];

  if (!result) {
    console.error("Error: Respuesta SOAP no contiene el tag esperado:", responseTag);
    return { success: false, loans: [] };
  }

  const success = result.getElementsByTagName("success")[0]?.textContent === "true";
  const message = result.getElementsByTagName("message")[0]?.textContent || "";
  const loans = result.getElementsByTagName("loans")[0]?.textContent;

  try {
    return {
      success,
      message,
      loans: JSON.parse(loans || "[]"),
    };
  } catch (e) {
    console.error("Error al parsear loans:", e, loans);
    return { success, loans: [] };
  }
};

/**
 * Manejar errores de solicitudes SOAP
 * @param {string} operation
 * @param {object} error
 */
const handleSOAPError = (operation, error) => {
  const status = error.response?.status || "N/A";
  const statusText = error.response?.statusText || "N/A";
  const data = error.response?.data || "No data";
  console.error(`Error en operación SOAP (${operation}):`, {
    status,
    statusText,
    response: data,
  });
};
