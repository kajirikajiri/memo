import { Button, CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../components/layout"
import { auth } from "../../scripts/firebase";

const Dashboard=()=>{
  const router = useRouter()
  const [buttonLoading, setButtonLoading] =useState(false)
  const handleSignOut = ()=>{
    try{
      setButtonLoading(true)
      auth.signOut().then(() => {
        router.push('/')
      }).catch((error) => { });
    } finally{
      setButtonLoading(false)
    }
  }
  return <Layout>
    <Box display="flex" justifyContent="flex-end" width="100%">
      <Button onClick={handleSignOut}>{buttonLoading ? <CircularProgress size={20}></CircularProgress>:'ログアウト'}</Button>
    </Box>
    dashboard
  </Layout>
}

export default Dashboard