

const omnyKey = process.env.OMNY_API_KEY

const OMNY_BASE_URI= "https://api.omnystudio.com/v1"

const options = {
   headers: {
    'Authorization': `Bearer ${process.env.OMNY_API_KEY}`
  }
}

export async function getNetworks (){
  const response = await fetch(`${OMNY_BASE_URI}/networks`, options)
  const networks = await response.json()
  return networks
}

export async function getProgramsByNetwork(networkId?: string) {
  const response = await fetch(`${OMNY_BASE_URI}/networks/${networkId}/programs`, options)
  const programs = await response.json()
  return programs
}