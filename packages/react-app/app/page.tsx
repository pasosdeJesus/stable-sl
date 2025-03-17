import HomePage from './home-page'
import AppProvider from '../providers/AppProvider'

export default function Page () {
  return (
    <AppProvider wcid={process.env.WC_PROJECT_ID} tesnet={process.env.NEXT_PUBLIC_ENABLE_TESTNETS == "true"}>
      <HomePage />
    </AppProvider>
  );
}
