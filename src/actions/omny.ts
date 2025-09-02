

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
  // console.log(networks)
  return networks
}