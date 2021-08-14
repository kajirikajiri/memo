import { Button, CircularProgress, TextField } from "@material-ui/core"
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons"
import { Box } from "@material-ui/system"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { PasswordChecker } from "../components/passwordChecker"
import { auth } from "../scripts/firebase"
import { passwordRegex } from "../scripts/regex"
import { useSnackbar } from 'material-ui-snackbar-provider'

const Action = ()=>{
  const router = useRouter()
  const snackbar = useSnackbar()
  const {oobCode} = router.query
  const [password, setPassword] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  
  useEffect(()=>{
    setPageLoading(false)
  }, [])
  const handleResetPassword =(e: React.FormEvent<HTMLFormElement>)=>{
    try {
      setButtonLoading(true)
      e.preventDefault()
      if (typeof oobCode ==='string') {
        auth.confirmPasswordReset(oobCode, password)
          .then(function() {
            router.push('/?pageState=signIn&dialogState=email')
          })
          .catch(function() {
            snackbar.showMessage('トークンの有効期限が切れています。もう一度やり直してください', 'close',()=>{})
          })
      } else {
        snackbar.showMessage('トークンの有効期限が切れています。もう一度やり直してください', 'close',()=>{})
      }
    } catch(e) {
      snackbar.showMessage('トークンの有効期限が切れています。もう一度やり直してください', 'close',()=>{})
    } finally {
      setButtonLoading(false)
    }
  }
  const handleChange = async(e:React.FormEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setPassword(e.currentTarget.value)
  }
  return <>
    <Box margin="50px auto" width={242} paddingX="24px" display="flex" flexDirection="column" alignItems="center" component="form" onSubmit={handleResetPassword}>
      {
          pageLoading ? <CircularProgress></CircularProgress>: <><Box display="flex" alignItems="center">
          <PasswordChecker password={password}/>
          <Box marginBottom={2}></Box>
          </Box>
          <TextField required type="password" label="password" defaultValue="" inputProps={{pattern: passwordRegex}} onChange={handleChange} />
          <Box height={20}></Box>
          <Button disabled={buttonLoading} fullWidth variant="contained" type="submit">
            {buttonLoading ? <CircularProgress size={24} ></CircularProgress> : '登録'}
          </Button>
          </>
      }
          </Box>
  </>
}

export default Action
