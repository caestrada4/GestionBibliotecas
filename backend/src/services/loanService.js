const soap = require('soap');
const Loan = require('../models/loan');

const loanService = {
  LoanService: {
    LoanPort: {
      CreateLoan: async ({ userId, bookId }) => {
        const loan = await Loan.create({ userId, bookId });
        return { success: true, loanId: loan.id };
      },
      ReturnLoan: async ({ loanId }) => {
        await Loan.update({ returnDate: new Date() }, { where: { id: loanId } });
        return { success: true };
      },
    },
  },
};

const wsdl = `
<definitions name="LoanService"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://example.com/LoanService/"
  targetNamespace="http://example.com/LoanService/">
  <message name="CreateLoanRequest">
    <part name="userId" type="xsd:int"/>
    <part name="bookId" type="xsd:int"/>
  </message>
  <message name="CreateLoanResponse">
    <part name="success" type="xsd:boolean"/>
    <part name="loanId" type="xsd:int"/>
  </message>
  <portType name="LoanPort">
    <operation name="CreateLoan">
      <input message="tns:CreateLoanRequest"/>
      <output message="tns:CreateLoanResponse"/>
    </operation>
  </portType>
</definitions>
`;

module.exports = { soapService: loanService, wsdl };
