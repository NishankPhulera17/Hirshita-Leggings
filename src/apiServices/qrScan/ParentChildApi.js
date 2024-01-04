import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const ParentChildApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        parentChildQrCodeScan : builder.mutation({
            query({token,data}){
                console.log("from verifyqr api",data)
                return {
                    url:`api/app/parentChildQrCodeScan`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify(data)
                    
                   
                }
            }
        })
    })
});


export const {useParentChildQrCodeScanMutation} = ParentChildApi