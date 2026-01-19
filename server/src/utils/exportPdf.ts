import PDFDocument from "pdfkit";

export const generateVendorPDF = (vendor: any, res: any) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=vendor-${vendor._id}.pdf`
  );

  doc.pipe(res);

  const section = (title: string) => {
    doc.moveDown().fontSize(14).text(title, { underline: true });
    doc.moveDown(0.5).fontSize(11);
  };

  doc.fontSize(18).text("Vendor Registration Details", { align: "center" });
  doc.moveDown();

  // Entity
  section("Entity Details");
  doc.text(`Name: ${vendor.entity.name}`);
  doc.text(`Category: ${vendor.entity.category}`);
  doc.text(`Email: ${vendor.entity.email}`);
  doc.text(`Website: ${vendor.entity.website || "-"}`);

  // Addresses
  section("Registered Address");
  doc.text(vendor.registeredAddress.address);
  doc.text(`PIN: ${vendor.registeredAddress.pin}`);
  doc.text(`Contact: ${vendor.registeredAddress.contactNumber}`);

  section("Communication Address");
  doc.text(vendor.communicationAddress.address);
  doc.text(`PIN: ${vendor.communicationAddress.pin}`);
  doc.text(`Contact: ${vendor.communicationAddress.contactNumber}`);

  // Tax
  section("Tax & Registration Details");
  doc.text(`PAN: ${vendor.taxDetails.pan}`);
  doc.text(`GST Applicable: ${vendor.taxDetails.gstApplicable}`);
  doc.text(`GST Number: ${vendor.taxDetails.gstNumber || "-"}`);
  doc.text(`MSME Applicable: ${vendor.taxDetails.msmeApplicable}`);
  doc.text(`MSME Number: ${vendor.taxDetails.msmeNumber || "-"}`);
  doc.text(`CIN: ${vendor.taxDetails.cinNumber || "-"}`);

  // Business
  section("Business Details");
  doc.text(`Establishment Type: ${vendor.businessDetails.establishmentType}`);
  doc.text(
    `Key Products: ${vendor.businessDetails.keyProducts?.join(", ")}`
  );
  doc.text(`Specific Products: ${vendor.businessDetails.specificProducts}`);
  doc.text(
    `Relation with AGIHF: ${vendor.businessDetails.hasRelationWithAGIHF}`
  );
  doc.text(
    `Relation Details: ${vendor.businessDetails.relationDetails || "-"}`
  );

  // Applicant
  section("Applicant Details");
  doc.text(`Applicant Name: ${vendor.applicant.name}`);
  doc.text(`Authorised Person: ${vendor.applicant.authorisedPerson}`);

  // Documents
  section("Submitted Documents");
  vendor.documents.forEach((docu: any, idx: number) => {
    doc.text(`${idx + 1}. ${docu.type} — ${docu.originalName}`);
  });

  section("System Info");
  doc.text(`Status: ${vendor.status}`);
  doc.text(`Submitted At: ${new Date(vendor.createdAt).toLocaleString()}`);

  doc.end();
};
