const Loan = require('../models/loan');
const User = require('../models/user');
const Book = require('../models/book');

// Servicio SOAP para reportes
const reportService = {
  ReportService: {
    ReportPort: {
      // Generar reporte de préstamos activos
      GetActiveLoansReport: async ({ startDate, endDate }) => {
        try {
          const whereClause = {};
          if (startDate || endDate) {
            whereClause.loanDate = {};
            if (startDate) whereClause.loanDate.$gte = new Date(startDate);
            if (endDate) whereClause.loanDate.$lte = new Date(endDate);
          }

          const loans = await Loan.findAll({
            where: whereClause,
            include: [
              { model: User, attributes: ['name', 'email'] },
              { model: Book, attributes: ['title'] },
            ],
          });

          const report = loans.map((loan) => ({
            loanId: loan.id,
            userName: loan.User.name,
            userEmail: loan.User.email,
            bookTitle: loan.Book.title,
            loanDate: loan.loanDate,
            returnDate: loan.returnDate,
            status: loan.returnDate ? 'Returned' : 'Active',
          }));

          return { success: true, report };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Generar historial de usuario
      GetUserLoanHistory: async ({ userId }) => {
        try {
          const user = await User.findByPk(userId, {
            include: [
              {
                model: Loan,
                include: [{ model: Book, attributes: ['title'] }],
              },
            ],
          });

          if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
          }

          const history = user.Loans.map((loan) => ({
            loanId: loan.id,
            bookTitle: loan.Book.title,
            loanDate: loan.loanDate,
            returnDate: loan.returnDate,
            status: loan.returnDate ? 'Returned' : 'Active',
            fines: loan.fines || 0,
          }));

          return { success: true, user: user.name, history };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
  },
};

// Definición del archivo WSDL para reportes
const wsdl = `
<definitions name="ReportService"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://example.com/ReportService/"
  targetNamespace="http://example.com/ReportService/">
  <message name="GetActiveLoansReportRequest">
    <part name="startDate" type="xsd:string"/>
    <part name="endDate" type="xsd:string"/>
  </message>
  <message name="GetActiveLoansReportResponse">
    <part name="success" type="xsd:boolean"/>
    <part name="report" type="xsd:string"/>
  </message>
  <message name="GetUserLoanHistoryRequest">
    <part name="userId" type="xsd:int"/>
  </message>
  <message name="GetUserLoanHistoryResponse">
    <part name="success" type="xsd:boolean"/>
    <part name="user" type="xsd:string"/>
    <part name="history" type="xsd:string"/>
  </message>
  <portType name="ReportPort">
    <operation name="GetActiveLoansReport">
      <input message="tns:GetActiveLoansReportRequest"/>
      <output message="tns:GetActiveLoansReportResponse"/>
    </operation>
    <operation name="GetUserLoanHistory">
      <input message="tns:GetUserLoanHistoryRequest"/>
      <output message="tns:GetUserLoanHistoryResponse"/>
    </operation>
  </portType>
</definitions>
`;

module.exports = { reportService, wsdl };
