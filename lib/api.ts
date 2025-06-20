export async function fetchBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
    return 0;
  }
}

export async function fetchUSDCOPRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=cop"
    );
    const data = await response.json();
    return data.usd.cop || 4000; // Fallback rate
  } catch (error) {
    console.error("Error fetching USD/COP rate:", error);
    // Fallback to approximate rate
    return 4000;
  }
}

export async function fetchHistoricalBitcoinPrice(
  date: string
): Promise<number> {
  try {
    // Convert date to DD-MM-YYYY format required by CoinGecko
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}`
    );
    const data = await response.json();

    if (
      data.market_data &&
      data.market_data.current_price &&
      data.market_data.current_price.usd
    ) {
      return data.market_data.current_price.usd;
    }

    // Fallback to current price if historical data is not available
    return await fetchBitcoinPrice();
  } catch (error) {
    console.error("Error fetching historical Bitcoin price:", error);
    // Fallback to current price
    return await fetchBitcoinPrice();
  }
}

export async function fetchHistoricalUSDCOPRate(date: string): Promise<number> {
  try {
    // Convert date to YYYY-MM-DD format
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];

    // Using exchangerate.host for historical data (free tier)
    const response = await fetch(
      `https://api.exchangerate.host/historical?date=${formattedDate}&base=USD&symbols=COP`
    );
    const data = await response.json();

    if (data.success && data.rates && data.rates.COP) {
      return data.rates.COP;
    }

    // Fallback to current rate if historical data is not available
    return await fetchUSDCOPRate();
  } catch (error) {
    console.error("Error fetching historical USD/COP rate:", error);
    // Fallback to current rate
    return await fetchUSDCOPRate();
  }
}
