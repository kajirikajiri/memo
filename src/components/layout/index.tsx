import { NextPage } from "next";
import { useEffect, useState } from "react";
import { auth } from "../../scripts/firebase";
import { useRouter } from 'next/router'
import { CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/system";

export const Layout:NextPage = ({children})=>{
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if (auth.currentUser)  {
      if (router.pathname === '/') {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    } else {
      if (router.pathname === '/') {
        setLoading(false)
      } else {
        router.push('/')
      }
    }
  }, [])
  return <>
    {loading ? <Box width="100%" height="200px" display="flex" justifyContent="center" alignItems="center"><CircularProgress></CircularProgress></Box> : children}
  </>
}