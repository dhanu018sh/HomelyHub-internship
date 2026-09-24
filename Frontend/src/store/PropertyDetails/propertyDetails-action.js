import {propertyDetailsActions} from "./propertyDetails-slice";
import {axiosInstance} from "../../utils/axios";

// featch details of one specific property using its id

// recv property id
// start loading
// call backend api
// wait for response
// get the property data
// store details in redux
// if error store error in redux


export const getPropertyDetails = (id) => async (dispatch) => {
    try{
        dispatch(propertyDetailsActions.getListRequest());
        const response = await axiosInstance(`/v1/rent/listing/${id}`);
        console.log(response);
        if(!response){
            throw new Error("Could not fetch property details");
        }

        dispatch(propertyDetailsActions.getpropertyDetails(response.data.data));
    }catch(error){
        dispatch(
            propertyDetailsActions.getErrors(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message
            )
        );
    }
}