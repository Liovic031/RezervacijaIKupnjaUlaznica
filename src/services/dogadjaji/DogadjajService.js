import { dogadjaji } from "./DogadjajPodaci";


// 1/4 Read od CRUD
async function get() {
    return {data: dogadjaji}
}

export default{
    get
}