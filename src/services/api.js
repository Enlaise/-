// Mock Data for Vendors
const MOCK_VENDORS = [
  {
    id: "1",
    name: "古著再造實驗室",
    category: "服飾",
    story: "我們將校園角落被遺忘的二手衣物，經過重新解構與縫製，賦予它們全新的生命。每一個補丁與不規則的剪裁，都在訴說著舊時光與新靈魂的碰撞。",
    socialMedia: "https://instagram.com/vintage_rebuild",
    products: "重製丹寧外套、手工拼接襯衫、零碎布料包包",
    location: "A01",
    image: "/assets/vendor-1.jpg"
  },
  {
    id: "2",
    name: "霧裏茶香",
    category: "飲食",
    story: "從木柵貓空採摘的在地青茶，結合政大周邊的霧氣記憶。我們提供的不只是一杯茶，而是你在山上圖書館熬夜時，那份熟悉的濕潤與溫暖。",
    socialMedia: "https://facebook.com/misty_tea",
    products: "鐵觀音鮮奶茶、包種冷泡茶、特製茶梅",
    location: "B03",
    image: "/assets/vendor-2.jpg"
  },
  {
    id: "3",
    name: "文字失重",
    category: "文創",
    story: "在數位時代裡，手寫文字彷彿失去了重量。我們將詩句與呢喃刻印在不同的媒材上（玻璃、金屬、再生紙），讓情緒重新獲得物理的實感。",
    socialMedia: "https://instagram.com/weightless_words",
    products: "刻字金屬書籤、詩句玻璃杯、再生紙手帳",
    location: "C02",
    image: "/assets/vendor-3.jpg"
  },
  {
    id: "4",
    name: "聲波共振場",
    category: "互動",
    story: "這是一個沒有實體商品的攤位。參與者可以透過特製的收音儀器，錄下自己的一段低語，系統會即時將聲音轉化為一段專屬的幾何圖形與環境聲響。",
    socialMedia: "https://linktr.ee/sonic_resonance",
    products: "聲音視覺化體驗、專屬明信片列印",
    location: "D05",
    image: "/assets/vendor-4.jpg"
  },
  {
    id: "5",
    name: "深夜食堂・政大分店",
    category: "飲食",
    story: "只在市集最後兩小時限定提供的療癒熱食。主打用最純粹的高湯與手打麵條，撫慰每一個在山城裡疲憊的靈魂。",
    socialMedia: "https://instagram.com/midnight_nccu",
    products: "清燉牛肉麵、暖胃關東煮",
    location: "B04",
    image: "/assets/vendor-5.jpg"
  }
];

/**
 * Fetch vendors from Google Apps Script.
 * Falls back to mock data if URL is not configured or fetch fails.
 */
export const fetchVendors = async () => {
  const scriptUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
  
  // If URL contains MOCK_URL, use mock data
  if (!scriptUrl || scriptUrl.includes('MOCK_URL')) {
    console.log('Using mock vendor data');
    return new Promise(resolve => {
      setTimeout(() => {
        // Convert mock string image to array for consistency
        const mappedMock = MOCK_VENDORS.map(v => ({...v, image: [v.image]}));
        resolve(mappedMock);
      }, 800); // Simulate network delay
    });
  }

  try {
    // Add cache buster to URL to ensure we always get fresh data without triggering CORS preflight
    const fetchUrl = new URL(scriptUrl);
    fetchUrl.searchParams.append('t', new Date().getTime());

    const response = await fetch(fetchUrl.toString());

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Process image URLs
    const processedData = data.map(vendor => {
      let imageArray = [];
      if (vendor.image) {
        // Force string type in case the cell contained a number
        const imageStr = String(vendor.image);
        // Split by comma or newline
        const urls = imageStr.split(/[\n,]+/);
        imageArray = urls.map(url => {
          let trimmedUrl = url.trim();
          
          // Extract Google Drive ID if present
          let driveId = null;
          if (trimmedUrl.includes('drive.google.com/open?id=')) {
            driveId = trimmedUrl.split('open?id=')[1].split('&')[0];
          } else if (trimmedUrl.includes('drive.google.com/file/d/')) {
            driveId = trimmedUrl.split('/file/d/')[1].split('/')[0];
          }
          
          // Use thumbnail endpoint to bypass Google Drive CORS/CORP restrictions
          if (driveId) {
            return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
          }
          
          return trimmedUrl;
        }).filter(url => url !== '');
      }
      
      // Fallback if empty
      if (imageArray.length === 0) {
        imageArray = [`/assets/vendor-${(Math.floor(Math.random() * 5) + 1)}.jpg`];
      }

      return {
        ...vendor,
        image: imageArray
      };
    });

    return processedData;
  } catch (error) {
    console.error('Failed to fetch vendors from GAS, using mock data:', error);
    return MOCK_VENDORS.map(v => ({...v, image: [v.image]}));
  }
};
