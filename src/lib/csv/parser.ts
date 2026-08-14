import { CSVParseResult, CSVRowValidation, Product } from '../../types';

export const SAMPLE_CSV_DATA = `Product Name,SKU,Category,Price,Cost,Units Sold,Stock
Aero-Lite Running Singlet,AURA-SNG-014,Activewear,48.00,12.50,310,140
Merino Trail Beanie,AURA-BN-002,Accessories,34.00,8.20,215,85
Reflective Ankle Gaiters,AURA-GTR-009,Accessories,26.00,7.10,180,60
Hydration Electrolyte Tablets (Pack of 12),AURA-TAB-001,Hardware,18.00,4.50,540,320
Cold-Shield Thermal Arm Warmers,AURA-ARM-007,Outerwear,32.00,9.00,195,110`;

export function parseAndValidateCSV(csvText: string, fileName = 'uploaded_data.csv'): CSVParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return {
      fileName,
      fileSize: 0,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      headers: [],
      previewRows: []
    };
  }

  // Parse header line
  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const headers = rawHeaders.map(h => h.toLowerCase());

  const previewRows: CSVRowValidation[] = [];
  let validCount = 0;
  let invalidCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    const rawObj: Record<string, string> = {};
    rawHeaders.forEach((header, idx) => {
      rawObj[header] = rawCols[idx] || '';
    });

    const errors: string[] = [];

    // Validation checks
    const name = rawCols[0] || '';
    const sku = rawCols[1] || '';
    const category = rawCols[2] || 'Uncategorized';
    const priceStr = rawCols[3] || '';
    const costStr = rawCols[4] || '';
    const unitsStr = rawCols[5] || '0';
    const stockStr = rawCols[6] || '0';

    if (!name) {
      errors.push('Missing Product Name');
    }
    if (!sku) {
      errors.push('Missing SKU identifier');
    }

    const price = parseFloat(priceStr);
    const cost = parseFloat(costStr);
    const units = parseInt(unitsStr, 10);
    const stock = parseInt(stockStr, 10);

    if (isNaN(price) || price <= 0) {
      errors.push(`Invalid Price: "${priceStr}"`);
    }
    if (isNaN(cost) || cost < 0) {
      errors.push(`Invalid Cost: "${costStr}"`);
    }
    if (price > 0 && cost > 0 && cost > price) {
      errors.push(`Warning: Cost ($${cost}) exceeds Price ($${price})`);
    }
    if (isNaN(units) || units < 0) {
      errors.push(`Invalid Units Sold: "${unitsStr}"`);
    }
    if (isNaN(stock) || stock < 0) {
      errors.push(`Invalid Stock: "${stockStr}"`);
    }

    const isValid = errors.filter(e => !e.startsWith('Warning:')).length === 0;

    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
    }

    const grossProfit = !isNaN(price) && !isNaN(cost) ? price - cost : 0;
    const margin = !isNaN(price) && price > 0 ? Number(((grossProfit / price) * 100).toFixed(1)) : 0;
    const revenue = !isNaN(price) && !isNaN(units) ? price * units : 0;

    const parsedProduct: Partial<Product> = {
      name,
      sku,
      category,
      price: isNaN(price) ? 0 : price,
      cost: isNaN(cost) ? 0 : cost,
      grossProfit,
      margin,
      unitsSold: isNaN(units) ? 0 : units,
      revenue,
      stock: isNaN(stock) ? 0 : stock,
      status: stock <= 0 ? 'out_of_stock' : stock < 30 ? 'low_stock' : 'in_stock',
      trend: 'neutral',
      trendPercent: 0,
    };

    previewRows.push({
      rowNumber: i,
      raw: rawObj,
      isValid,
      errors,
      parsed: parsedProduct
    });
  }

  return {
    fileName,
    fileSize: csvText.length,
    totalRows: lines.length - 1,
    validRows: validCount,
    invalidRows: invalidCount,
    headers: rawHeaders,
    previewRows
  };
}
