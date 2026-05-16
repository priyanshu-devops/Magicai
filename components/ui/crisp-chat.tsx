"use client"
import { useEffect } from "react";
import {Crisp} from 'crisp-sdk-web'
export const CrispChat= () =>{
    useEffect(() => {
      
    Crisp.configure("2f170b1f-8b45-4e5f-9466-c2f06d60ee0a")
      
    }, []);
    return null;
    

}