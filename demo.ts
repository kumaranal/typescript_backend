
  
  function findLowestPrice(products: []|any, requirements: []|any): number | null {
    let lowestPrice: number | null = null;
  
    for (const product of products) {
      const productDetails = new Map(product.details.map((detail:any) => [detail.size, detail]));
  
      let totalCost = 0;
      let requirementsFulfilled = true;
  
      for (const requirement of requirements) {
        const detail:any = productDetails.get(requirement.size);
  
        if (detail && detail.quantity >= requirement.quantity) {
          totalCost += detail.price * requirement.quantity;
        } else {
          requirementsFulfilled = false;
          break;
        }
      }
  
      if (requirementsFulfilled) {
        if (lowestPrice === null || totalCost < lowestPrice) {
          lowestPrice = totalCost;
        }
      }
    }
  
    return lowestPrice;
  }
  
  const products: []|any = [
    {
      _id: "65433c7928f2070c4ac9d6ad",
      product_name: "appron",
      product_UniqueCode: "code123",
      details: [
        { size: "S", quantity: 12, price: 20.99, _id: "654341eb769d508fe20b5337" },
        { size: "XXL", quantity: 15, price: 24.99, _id: "65433c7928f2070c4ac9d6af" },
        { size: "XL", quantity: 5, price: 15.99, _id: "654341eb769d508fe20b5338" },
      ],
      __v: 1,
    },
    {
      _id: "65433d48fcd3ee3cc6a81618",
      product_name: "Sample Product",
      product_UniqueCode: "code12344",
      details: [
        { size: "XL", quantity: 10, price: 19.99, _id: "65433d48fcd3ee3cc6a81619" },
        { size: "XXL", quantity: 15, price: 24.99, _id: "65433d48fcd3ee3cc6a8161a" },
      ],
      __v: 0,
    },
  ];
  
  const requirements: []|any = [
    { size: "XL", quantity: 5 },
    { size: "XXL", quantity: 5 },
  ];
  
  const lowestPrice = findLowestPrice(products, requirements);
  
  if (lowestPrice !== null) {
    console.log(`The lowest price to fulfill the requirements is: $${lowestPrice.toFixed(2)}`);
  } else {
    console.log("The requirements cannot be fulfilled with the available products.");
  }
  