function updateInvoice() {
    document.getElementById('billNoDisplay').textContent = document.getElementById('billNo').value;
    document.getElementById('billDateDisplay').textContent = document.getElementById('billDate').value;
    document.getElementById('modeOfTransportDisplay').textContent = document.getElementById('modeOfTransport').value;
    document.getElementById('vehicleNoDisplay').textContent = document.getElementById('vehicleNo').value;
    document.getElementById('rstNoDisplay').textContent = document.getElementById('rstNo').value;
    document.getElementById('dateOfSupplyDisplay').textContent = document.getElementById('dateOfSupply').value;
    document.getElementById('netQtyDisplay').textContent = document.getElementById('netQty').value;
    document.getElementById('totalDisplay').textContent = document.getElementById('total').value;
    document.getElementById('totalRoundedDisplay').textContent = document.getElementById('totalRounded').value;
    document.getElementById('totalBeforeTaxDisplay').textContent = document.getElementById('totalRounded').value;
    document.getElementById('totalAfterTaxDisplay').textContent = document.getElementById('totalRounded').value;
    // document.getElementById('totalBeforeTaxDisplay').textContent = document.getElementById('totalBeforeTax').value;
    // document.getElementById('totalAfterTaxDisplay').textContent = document.getElementById('totalAfterTax').value;
    document.getElementById('totalInWordsDisplay').textContent = document.getElementById('totalInWords').value;
}

function downloadPDF() {
    const invoice = document.getElementById('invoice');

    // Temporarily scale for desktop width
    invoice.style.width = '210mm';
    invoice.style.zoom = '1';

    html2canvas(invoice, { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');

        // Reset zoom after download
        invoice.style.zoom = '';
    });
}

function downloadWord() {
    const invoiceContent = document.getElementById('invoice').innerHTML;
    const blob = new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
        document.querySelector('style').innerText +
        '</style></head><body>' + invoiceContent + '</body></html>'],
        { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.doc';
    link.click();
}

function multiplyNumbers() {
    const num1 = parseFloat(document.getElementById('netQty').value);
    const num2 = 2160;

    // Check if the inputs are valid numbers
    if (!isNaN(num1) && !isNaN(num2)) {
        const result = (num1 * num2).toFixed(2);
        const product = Math.trunc(num1 * num2) + ".00";

        document.getElementById('total').value = result;
        document.getElementById('totalRounded').value = product;
        // document.getElementById('totalBeforeTax').value = product;
        // document.getElementById('totalAfterTax').value = product;

        function convertToWords(num) {
            const a = [
                '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
                'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
            ];
            const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

            function numToWords(n) {
                if (n < 20) return a[n];
                if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : '');
                if (n < 1000) return a[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' ' + numToWords(n % 100) : '');
                if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' THOUSAND' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
                return '';
            }

            return numToWords(num) + ' RUPEES ONLY';
        }
        document.getElementById('totalInWords').value = convertToWords(Math.trunc(num1 * num2))
        console.log(convertToWords(Math.trunc(num1 * num2)));

        // 🚨 Check for E-Way Bill requirement
        if (parseInt(product.replace(".00", "")) > 50000) {
            const eBillAlert = "Amount is above 50,000 Rupees. Create E-Way Bill and submit Invoice <br> https://ewaybillgst.gov.in/login.aspx";
            document.getElementById("eBillAlert").textContent = eBillAlert;
            document.getElementById("eBillSystem").textContent = "Click Here to Generate E-Way Bill";
        } else {
            document.getElementById("eBillAlert").textContent = "E-Way Bill NOT Required(Amount < Rs.50,000)";
            document.getElementById("eBillSystem").textContent = "";
        }
    } else {
        document.getElementById('total').value = "Invalid input";
    }
}

flatpickr("#billDate", {
    dateFormat: "d/m/Y", // dd/mm/yyyy format
    allowInput: true
});

flatpickr("#dateOfSupply", {
    dateFormat: "d/m/Y", // dd/mm/yyyy format
    allowInput: true
});

function loadPOData() {
    fetch('/po_data.json')
        .then(res => res.json())
        .then(data => {
            console.log("Data:", data)
        })
}

//Extra Data
// When the page loads, populate the inputs
// window.onload = function () {
//     document.getElementById("billNo").value = invoiceData.BillNo;
//     document.getElementById("billDate").value = invoiceData.BillDate;
//     document.getElementById("vehicleNo").value = invoiceData.VehicleNo;
//     document.getElementById("rstNo").value = invoiceData.TicketNo;
//     document.getElementById("dateOfSupply").value = invoiceData.DateOfSupply;
//     document.getElementById("netQty").value = invoiceData.NetQtyMT;
// };

const detailsOfVendor = {
    "BillNo": "WGU/SGS/JA-0831",
    "BillDate": "08/10/2025",
    "PurchaseOrderNo": "249041989",
    "PODate": "21/07/2025",
    "SupplierDetails": {
        "CompanyName": "MS SHAKTHI GREEN SUPPLIES LLP",
        "Address": "Flat No. 306, 2nd Block, 16-2-153/1/17014, Surdhama Elegance, SBH Colony, Saidabad (Hyderabad), Hyderabad, Telangana - 500059",
        "GSTIN": "36AFNFS281D1ZN",
        "PAN": "AFNFS281D1",
        "StateNameCode": "TELANGANA, 36"
    },
    "DeliveryDetails": {
        "Address": "Reliance Industries Limited, Survey No: 820/1A, 816-1A1, 816-1B, 816-1C, 816-1C1, Peyyapallem Village, Taluka: Kodavur Mandal, District: Nellore, Andhra Pradesh - 524317"
    },
    "TransportDetails": {
        "ModeOfTransport": "TRACTOR & TROLLEY",
        "VehicleNo": "TS 21 AP 1993",
        "TicketNo": "175",
        "DateOfSupply": "08/10/2025",
        "PlaceOfSupply": "Gandavaram, Andhra Pradesh"
    }
}

const BankDetails = {
    "AccountHolderName": "M/S SHAKTHI GREEN SUPPLIES LLP",
    "AccountType": "Current",
    "AccountNumber": "240911010000057",
    "IFSCCode": "UBIN0824097",
    "BankName": "UNION BANK OF INDIA",
    "BankAddress": "GADDIANNARAM, DILSUKHNAGAR, HYDERABAD - 500060"
}

const VendorDetails = {
    "DocumentTitle": "BILL OF SUPPLY",
    "RecipientCopy": true,
    "CompanyName": "SHAKTHI GREEN SUPPLIES LLP",
    "Address": "No. 306, 2nd Block, 16-2-753/121/1/7014, Sumadhura Elegance, SBH Colony, Saidabad (Hyderabad), Hyderabad, Telangana - 500059",
    "ContactNo": "8106027929",
    "Email": "Patternmareen.lnd@gmail.com",
    "RILVendorCode": "001-3815957"
}

const BillTo = {
    "CompanyName": "Reliance Industries Limited",
    "Address": "Survey No: 820/1A, 1618-1A1, 1618-1C, 1619/1&2, 1621/1, Peryapalem Village, Taluka: Kodavaluru Mandal, Peryapalam, Sri Potti Sriramulu Nellore, Andhra Pradesh - 524317",
    "GSTIN": "37AAACR5055K3Z4",
    "PAN": "AAACR5055K"
}

const ShipTo = {
    "CompanyName": "Reliance Industries Limited",
    "Address": "Survey No: 820/1A, 1618-1A1, 1618-1C, 1619/1&2, 1621/1, Peryapalem Village, Taluka: Kodavaluru Mandal, Peryapalam, Sri Potti Sriramulu Nellore, Andhra Pradesh - 524317",
    "GSTIN": "37AAACR5055K3Z4",
    "PAN": "AAACR5055K"
}

const InvoiceTable = {
    "Items": [
        {
            "SNo": 1,
            "Description": "ANIMAL DUNG",
            "HSNCode": "31010091",
            "NetQtyMT": 30.23,
            "Rate": 2160,
            "CGST": 0,
            "SGST": 0,
            "IGST": 0,
            "TotalRs": 65296.80
        }
    ],
    "RoundOff": 0,
    "TotalRounded": 65296.00,
    "AmountInWords": "SIXTY-FIVE THOUSAND TWO HUNDRED NINETY-SIX RUPEES ONLY",
    "TotalAmountBeforeTax": 65296.00,
    "AddCGST": 0,
    "AddSGST": 0,
    "AddIGST": 0,
    "TotalAmountAfterTax": 65296.00,
    "ReverseCharge": "NO",
    "EOE": true
}
