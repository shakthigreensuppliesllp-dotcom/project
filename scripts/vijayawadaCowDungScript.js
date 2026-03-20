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
    const num2 = 1950;

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