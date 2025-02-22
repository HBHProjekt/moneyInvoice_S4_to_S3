document.getElementById('transformButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const output = document.getElementById('output');

    if (fileInput.files.length === 0) {
        alert('Please select an XML file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const xmlString = event.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

        // Transform the XML here
        const transformedXml = transformXml(xmlDoc);

        const serializedXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(transformedXml);
        output.textContent = serializedXml;

        // Create a download link
        const blob = new Blob([serializedXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;        
        //name download file with current date and time in format YYYY-MM-DD_HH-MM-SS and add _S4_prijate.xml
        const date = new Date();
        const dateStr = date.toISOString().slice(0,10) + '_' + date.toTimeString().slice(0,8).replace(/:/g, '-');
        a.download = dateStr + '_S4_prijate.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    reader.readAsText(file);
});

function transformXml(xmlDoc) {
    const moneyData = xmlDoc.createElement('MoneyData');

    const seznamFaktPrij = xmlDoc.createElement('SeznamFaktPrij');
    moneyData.appendChild(seznamFaktPrij);

    const fakturaPrijataList = xmlDoc.getElementsByTagName('FakturaPrijata');
    for (let i = 0; i < fakturaPrijataList.length; i++) {
        const fakturaPrijata = fakturaPrijataList[i];
        const faktPrij = xmlDoc.createElement('FaktPrij');

        const doklad = xmlDoc.createElement('Doklad');
        doklad.textContent = fakturaPrijata.getElementsByTagName('CisloDokladu')[0]?.textContent || '';
        faktPrij.appendChild(doklad);

        const popis = xmlDoc.createElement('Popis');
        popis.textContent = fakturaPrijata.getElementsByTagName('Nazev')[0]?.textContent || '';
        faktPrij.appendChild(popis);

        const vystaveno = xmlDoc.createElement('Vystaveno');
        vystaveno.textContent = fakturaPrijata.getElementsByTagName('DatumVystaveni')[0]?.textContent.slice(0,10) || '';
        faktPrij.appendChild(vystaveno);

        const datUcPr = xmlDoc.createElement('DatUcPr');
        datUcPr.textContent = fakturaPrijata.getElementsByTagName('DatumUcetnihoPripadu')[0]?.textContent.slice(0,10) || '';
        faktPrij.appendChild(datUcPr);

        const plnenoDPH = xmlDoc.createElement('PlnenoDPH');
        plnenoDPH.textContent = fakturaPrijata.getElementsByTagName('DatumPlneni')[0]?.textContent.slice(0,10) || '';
        faktPrij.appendChild(plnenoDPH);

        const splatno = xmlDoc.createElement('Splatno');
        splatno.textContent = fakturaPrijata.getElementsByTagName('DatumSplatnosti')[0]?.textContent.slice(0,10) || '';
        faktPrij.appendChild(splatno);

        const doruceno = xmlDoc.createElement('Doruceno');
        doruceno.textContent = fakturaPrijata.getElementsByTagName('DatumZauctovani')[0]?.textContent.slice(0,10) || '';
        faktPrij.appendChild(doruceno);

        const varSymbol = xmlDoc.createElement('VarSymbol');
        varSymbol.textContent = fakturaPrijata.getElementsByTagName('VariabilniSymbol')[0]?.textContent || '';
        faktPrij.appendChild(varSymbol);

        const zakazka = xmlDoc.createElement('Zakazka');
        zakazka.textContent = fakturaPrijata.getElementsByTagName('Zakazka_ID')[0]?.textContent || '9999/9999';

        //19b61351-2c27-4e5f-a2cb-5c3925a1603e <- 2025/0001
        if (zakazka.textContent === '19b61351-2c27-4e5f-a2cb-5c3925a1603e' || zakazka.textContent === 'b313130c-1af1-4431-b03a-63c9b3ed29d6') {
            zakazka.textContent = '2025/0001';
        }
        
        faktPrij.appendChild(zakazka);

        const souhrnDPH = xmlDoc.createElement('SouhrnDPH');

        const zaklad0 = xmlDoc.createElement('Zaklad0');
        zaklad0.textContent = fakturaPrijata.getElementsByTagName('DPH0')[0]?.getElementsByTagName('Zaklad')[0]?.textContent || 0;
        souhrnDPH.appendChild(zaklad0);
        const zaklad5 = xmlDoc.createElement('Zaklad5');
        zaklad5.textContent = fakturaPrijata.getElementsByTagName('DPH1')[0]?.getElementsByTagName('Zaklad')[0]?.textContent || 0;
        souhrnDPH.appendChild(zaklad5);
        const zaklad22 = xmlDoc.createElement('Zaklad22');
        zaklad22.textContent = fakturaPrijata.getElementsByTagName('DPH2')[0]?.getElementsByTagName('Zaklad')[0]?.textContent || 0;
        souhrnDPH.appendChild(zaklad22);
        const dph5 = xmlDoc.createElement('DPH5');
        dph5.textContent = fakturaPrijata.getElementsByTagName('DPH1')[0]?.getElementsByTagName('Dan')[0]?.textContent || 0;
        souhrnDPH.appendChild(dph5);
        const dph22 = xmlDoc.createElement('DPH22');
        dph22.textContent = fakturaPrijata.getElementsByTagName('DPH2')[0]?.getElementsByTagName('Dan')[0]?.textContent || 0;
        souhrnDPH.appendChild(dph22);

        faktPrij.appendChild(souhrnDPH);

        const celkem = xmlDoc.createElement('Celkem');
        celkem.textContent = fakturaPrijata.getElementsByTagName('CenaCelkem')[0]?.textContent || '';
        faktPrij.appendChild(celkem);

        const dodOdb = xmlDoc.createElement('DodOdb');

        const obchNazevDodOdb = xmlDoc.createElement('ObchNazev');
        obchNazevDodOdb.textContent = fakturaPrijata.getElementsByTagName('Adresa')[0]?.getElementsByTagName('Nazev')[0]?.textContent || '';
        dodOdb.appendChild(obchNazevDodOdb);
        const ico1 = xmlDoc.createElement('ICO');
        ico1.textContent = fakturaPrijata.getElementsByTagName('IC')[0]?.textContent || '';
        dodOdb.appendChild(ico1);
        const dic1 = xmlDoc.createElement('DIC');
        dic1.textContent = fakturaPrijata.getElementsByTagName('DIC')[0]?.textContent || '';
        dodOdb.appendChild(dic1);

        faktPrij.appendChild(dodOdb);

        const seznamPolozek = xmlDoc.createElement('SeznamPolozek');
        const polozky = fakturaPrijata.getElementsByTagName('PolozkaFakturyPrijate');
        for (let i = 0; i < polozky.length; i++) {
            const polozka = polozky[i];
            const newPolozka = xmlDoc.createElement('Polozka');

            const popis = xmlDoc.createElement('Popis');
            popis.textContent = polozka.getElementsByTagName('Nazev')[0]?.textContent || '';
            newPolozka.appendChild(popis);

            const pocetMJ = xmlDoc.createElement('PocetMJ');
            pocetMJ.textContent = parseInt(polozka.getElementsByTagName('Mnozstvi')[0]?.textContent) || '';
            newPolozka.appendChild(pocetMJ);

            const sazbaDPH = xmlDoc.createElement('SazbaDPH');
            sazbaDPH.textContent = parseInt(polozka.getElementsByTagName('DPH')[0]?.getElementsByTagName('Sazba')[0]?.textContent) || 0;
            newPolozka.appendChild(sazbaDPH);

            const cena = xmlDoc.createElement('Cena');
            cena.textContent = parseInt(polozka.getElementsByTagName('CelkovaCena')[0]?.textContent) || 0;
            newPolozka.appendChild(cena);
            
            const valuty = xmlDoc.createElement('Valuty');
            valuty.textContent = 0;
            newPolozka.appendChild(valuty);

            const zakazka = xmlDoc.createElement('Zakazka');
            zakazka.textContent = polozka.getElementsByTagName('Zakazka_ID')[0]?.textContent || '9999/9999'; 
            
            if (zakazka.textContent === '') {
                zakazka.textContent = fakturaPrijata.getElementsByTagName('Zakazka_ID')[0]?.textContent || '9999/9999';
            }

            //19b61351-2c27-4e5f-a2cb-5c3925a1603e <- 2025/0001
            if (zakazka.textContent === '19b61351-2c27-4e5f-a2cb-5c3925a1603e' || zakazka.textContent === 'b313130c-1af1-4431-b03a-63c9b3ed29d6') {
                zakazka.textContent = '2025/0001';
            }

            newPolozka.appendChild(zakazka);

            seznamPolozek.appendChild(newPolozka);
        }
        faktPrij.appendChild(seznamPolozek);
        //if seznamPolozek does not contain any items, remove it from 



        const mojeFirmaS4 = fakturaPrijata.getElementsByTagName('MojeFirma')[0];

        const mojeFirma = xmlDoc.createElement('MojeFirma');

        const nazev = xmlDoc.createElement('Nazev');
        nazev.textContent = mojeFirmaS4.getElementsByTagName('Nazev')[0]?.textContent || '';
        mojeFirma.appendChild(nazev);
        const mojeFirmaico = xmlDoc.createElement('ICO');
        mojeFirmaico.textContent = mojeFirmaS4.getElementsByTagName('IC')[0]?.textContent || '';
        mojeFirma.appendChild(mojeFirmaico);
        const mojeFirmadic = xmlDoc.createElement('DIC');
        mojeFirmadic.textContent = mojeFirmaS4.getElementsByTagName('DIC')[0]?.textContent || '';
        mojeFirma.appendChild(mojeFirmadic);

        const stat = mojeFirmaS4.getElementsByTagName('Stat')[0]?.textContent || '';
        const menaKod = xmlDoc.createElement('MenaKod');
        menaKod.textContent = (stat === 'Česká republika') ? 'CZK' : 'EUR';
        mojeFirma.appendChild(menaKod);

        faktPrij.appendChild(mojeFirma);

        seznamFaktPrij.appendChild(faktPrij);
    }




    return moneyData;
}