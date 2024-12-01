const { faker } = require('@faker-js/faker');
const { writeFileSync } = require('fs');
const zareki_products = [
  "Zareki Timetable",
  "Zareki Finance",
  "Zareki Analytics",
];
const generateProducts = () => {
  const products = ["a", "b", "c"];
  const numberOfProducts = faker.number.int({
    min: 1,
    max: zareki_products.length,
  });
  return faker.helpers.shuffle(products).slice(0, numberOfProducts);
};

const generateSchools = (numSchools) => {
  const schools = [];
  for (let i = 0; i < numSchools; i++) {
    schools.push({
      id: faker.number.int({ min: 10000, max: 70000 }),
      name: faker.company.name(),
      type: faker.helpers.arrayElement(["Primary", "Secondary", "IGCSE"]),
      products: generateProducts(),
      county: faker.location.county(),
      registrationDate: faker.date.past().toISOString(),
      contact: {
        email: faker.internet.email(),
      },
    });
  }
  return schools;
};

const generateInvoices = (numInvoices, schools) => {
  const invoices = [];
  const amount = faker.finance.amount({ min: 5000, max: 30000 });
  const amountPaid = 0;
  const balance = amount - amountPaid;
  
  for (let i = 0; i < numInvoices; i++) {
    const school = faker.helpers.arrayElement(schools);
    const creationDate = faker.date.past().toISOString();
    const dueDate = faker.date.future().toISOString();
    const daysUntilDue = Math.ceil((new Date(dueDate) - new Date(creationDate)) / (1000 * 60 * 60 * 24));

    
    invoices.push({
      id: faker.number.int({ min: 10000, max: 70000 }),
      invoiceNumber: faker.number.int({ min: 100, max: 10000 }),
      invoiceItem: faker.helpers.arrayElement(zareki_products),
      creationDate: creationDate,
      dueDate: dueDate,
      amount: amount,
      amountPaid: amountPaid,
      balance: balance,
      completionStatus: faker.datatype.boolean(),
      daysUntilDue: daysUntilDue,
      client: school.name,
    });
  }
  return invoices;
};

const statuses = ["Valid", "Bounced"];

const generateCollections = (numCollections, schools, invoices) => {
  const collections = [];
  for (let i = 0; i < numCollections; i++) {
    const school = faker.helpers.arrayElement(schools);
    collections.push({
      id: faker.number.int({ min: 10000, max: 70000 }),
      invoiceNumber: faker.helpers.arrayElement(invoices).invoiceNumber,
      collectionNumber: faker.number.int({ min: 100, max: 10000 }),
      dateOfCollection: faker.date.past().toISOString(),
      status: faker.helpers.arrayElement(statuses),
      amount: faker.finance.amount({ min: 5000, max: 30000 }),
      client: school.name,
    });
  }
  return collections;
};

const numSchools = 10;
const numInvoices = 50;
const numCollections = 30;

const schools = generateSchools(numSchools);
const invoices = generateInvoices(numInvoices, schools);
const collections = generateCollections(numCollections, schools, invoices);

const data = {
  schools,
  invoices,
  collections,
};

writeFileSync("data.json", JSON.stringify(data, null, 2));
console.log("Data generated and saved to data.json");
