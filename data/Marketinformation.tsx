import * as propertyData from '../assets/Properties.json'

interface Property {
    name: string;
    address: string;
    city: string;
    price: string;
    caprate: string;
    noi: string;
    type: string;
    executivesummary: string;
    picture1: string;
    picture2: string;
    picture3: string;
    TokenID: string;
    subType: string;
    buildingSize: string;
    lotSize: string;
    propertyClass: string;
    stories: string;
    yearBuilt: string;
    averageOccupancy: string;
    leaseTerm: string;
    zoning: string;
    zoningLink: string;
    additionalDetails: string;
    grossIncome: string;
    grossExpenses: string;
  }
  
  interface Properties {
    [key: string]: Property;
  }


function FetchPropertyInformation(itemid: number){
    const properties = propertyData as Properties;
    let requestKey = `IRET000${itemid}`
    return properties[requestKey]
}


export default FetchPropertyInformation


