import toast from "react-hot-toast";
import {baseUrl} from "../constant/url";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate: follow, isPending, error} = useMutation({
        mutationFn: async (userId)=>{
            try{
                const res = await fetch(`${baseUrl}/api/users/follow/${userId}`,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error||"Something went wrong")
                }
                return data;
            }
            catch(error){
                throw error;
            }
        },

        onSuccess : ()=>{
            Promise.all([
            queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
            queryClient.invalidateQueries({queryKey: ["authUser"]})
            ]);
        },

        onError : ()=>{
            toast.error(error.message)
        }
    })

    return {follow, isPending}
}

export default useFollow
