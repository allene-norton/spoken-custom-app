import { Network } from "@/app/types"

const omnyKey = process.env.OMNY_API_KEY

const OMNY_BASE_URI= "https://api.omnystudio.com/v1"

const options = {
   headers: {
    'Authorization': `Bearer ${process.env.OMNY_API_KEY}`
  }
}

export async function getNetworkByName (companyName: string | undefined){
  const response = await fetch(`${OMNY_BASE_URI}/networks`, options)
  const networks = await response.json()
   const network: Network | undefined = networks?.Items.find(
    (network: Network) => network.Name === companyName,
  );

  return network
}

export async function getProgramsByNetwork(networkId?: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/networks/${networkId}/programs`, options)
  const programs = await response.json()
  return programs.Items
}