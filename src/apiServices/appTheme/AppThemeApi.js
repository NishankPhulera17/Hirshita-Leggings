import { slug } from "../../utils/Slug";
import { baseApi } from "../baseApi";

export const AppThemeApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppThemeData : builder.mutation({
            query(clientName){
                console.log("cient name". clientName)
                return {
                    url:`/api/admin/vendorTheme/${clientName}`,
                    method:'get',
                    headers:{"Content-Type": "application/json"},
                    slug:slug
                   
                }
            }
        })
    })
});


export const {useGetAppThemeDataMutation} = AppThemeApi

