document.getElementById('transformButtonVydane').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInputVydane');
    const output = document.getElementById('outputVydane');

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
        const transformedXml = transformXmlVydane(xmlDoc);

        const serializedXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(transformedXml);
        output.textContent = serializedXml;

        // Create a download link
        const blob = new Blob([serializedXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        //name download file with current date and time in format YYYY-MM-DD_HH-MM-SS and add _S4_vydane.xml
        const date = new Date();
        const dateStr = date.toISOString().slice(0,10) + '_' + date.toTimeString().slice(0,8).replace(/:/g, '-');
        a.download = dateStr + '_S4_vydane.xml';        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    reader.readAsText(file);
});

function transformXmlVydane(xmlDoc) {
    
    const moneyData = xmlDoc.createElement('MoneyData');

    const seznamFaktVyd = xmlDoc.createElement('SeznamFaktVyd');
    moneyData.appendChild(seznamFaktVyd);

    const fakturaVydanaList = xmlDoc.getElementsByTagName('FakturaVydana');
    for (let i = 0; i < fakturaVydanaList.length; i++) {
        const fakturaVydana = fakturaVydanaList[i];
        const faktVyd = xmlDoc.createElement('FaktVyd');

        const doklad = xmlDoc.createElement('Doklad');
        doklad.textContent = fakturaVydana.getElementsByTagName('CisloDokladu')[0]?.textContent || '';
        faktVyd.appendChild(doklad);

        const popis = xmlDoc.createElement('Popis');
        popis.textContent = fakturaVydana.getElementsByTagName('Nazev')[0]?.textContent || '';
        faktVyd.appendChild(popis);

        const vystaveno = xmlDoc.createElement('Vystaveno');
        vystaveno.textContent = fakturaVydana.getElementsByTagName('DatumVystaveni')[0]?.textContent.slice(0,10) || '';
        faktVyd.appendChild(vystaveno);

        const datUcPr = xmlDoc.createElement('DatUcPr');
        datUcPr.textContent = fakturaVydana.getElementsByTagName('DatumUcetnihoPripadu')[0]?.textContent.slice(0,10) || '';
        faktVyd.appendChild(datUcPr);

        const plnenoDPH = xmlDoc.createElement('PlnenoDPH');
        plnenoDPH.textContent = fakturaVydana.getElementsByTagName('DatumPlneni')[0]?.textContent.slice(0,10) || '';
        faktVyd.appendChild(plnenoDPH);

        const splatno = xmlDoc.createElement('Splatno');
        splatno.textContent = fakturaVydana.getElementsByTagName('DatumSplatnosti')[0]?.textContent.slice(0,10) || '';
        faktVyd.appendChild(splatno);

        const varSymbol = xmlDoc.createElement('VarSymbol');
        varSymbol.textContent = fakturaVydana.getElementsByTagName('VariabilniSymbol')[0]?.textContent || '';
        faktVyd.appendChild(varSymbol);

        const textPredFa = xmlDoc.createElement('TextPredFa');
        textPredFa.textContent = fakturaVydana.getElementsByTagName('TextyFaktura')[0]?.getElementsByTagName('PredCenami')[0]?.textContent || '';
        faktVyd.appendChild(textPredFa);

        const textZaFa = xmlDoc.createElement('TextZaFa');
        textZaFa.textContent = fakturaVydana.getElementsByTagName('TextyFaktura')[0]?.getElementsByTagName('ZaCenami')[0]?.textContent || '';
        faktVyd.appendChild(textZaFa);

        const zakazka = xmlDoc.createElement('Zakazka');
        
        const regex = /(?<=\s|\(|\[|^)\d{4}[\/_]\d{4}(?=\s|\)|\]|$)/;
        const matchPredFa = textPredFa.textContent.match(regex);
        const matchZaFa = textZaFa.textContent.match(regex);

        if (matchPredFa) {
            zakazka.textContent = matchPredFa[0].replace(/[\s\(\)\[\]]/g, '').trim();
        } else if (matchZaFa) {
            zakazka.textContent = matchZaFa[0].replace(/[\s\(\)\[\]]/g, '').trim();
        } else {
            zakazka.textContent = fakturaVydana.getElementsByTagName('Zakazka_ID')[0]?.textContent || '';
        }

        faktVyd.appendChild(zakazka);

        const dodOdb = xmlDoc.createElement('DodOdb');

        const obchNazev = xmlDoc.createElement('ObchNazev');
        obchNazev.textContent = fakturaVydana.getElementsByTagName('Adresa')[0]?.getElementsByTagName('Nazev')[0]?.textContent || '';
        dodOdb.appendChild(obchNazev);        
        const ico = xmlDoc.createElement('ICO');
        ico.textContent = fakturaVydana.getElementsByTagName('IC')[0]?.textContent || '';
        dodOdb.appendChild(ico);
        const dic = xmlDoc.createElement('DIC');
        dic.textContent = fakturaVydana.getElementsByTagName('DIC')[0]?.textContent || '';
        dodOdb.appendChild(dic);

        faktVyd.appendChild(dodOdb);

        const seznamPolozek = xmlDoc.createElement('SeznamPolozek');
        const polozky = fakturaVydana.getElementsByTagName('PolozkaFakturyVydane');
        for (let i = 0; i < polozky.length; i++) {
            const polozka = polozky[i];
            const newPolozka = xmlDoc.createElement('Polozka');

            const popis = xmlDoc.createElement('Popis');
            popis.textContent = polozka.getElementsByTagName('Nazev')[0]?.textContent || 'Polozka';
            newPolozka.appendChild(popis);

            const pocetMJ = xmlDoc.createElement('PocetMJ');
            pocetMJ.textContent = polozka.getElementsByTagName('PocetMJ')[0]?.textContent || 1;
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

            seznamPolozek.appendChild(newPolozka);
        }
        faktVyd.appendChild(seznamPolozek);
        
        const mojeFirmaS4 = fakturaVydana.getElementsByTagName('MojeFirma')[0];

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

        faktVyd.appendChild(mojeFirma);

        seznamFaktVyd.appendChild(faktVyd);
    }

    return moneyData;
}