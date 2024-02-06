import "./App.css";
import PageRoutes from "./PageRoutes";

function App() {


  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       try {
  //         const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
  //         if (userDoc.exists()) {
  //           const userData = userDoc.data();
  //           console.log(userData)
  //           dispatch(setUser({
  //             uid: user.uid,
  //             email: user.email,
  //             displayName: userData.displayName,
  //             role: userData.role,
  //             password:userData.password,
  //             foodvalue:userData.foodValue,
  //             housevalue:userData.housingValue
  //           }));
  //         } else {
  //           setUser(null);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //         setUser(null);
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);


  return (
    <>

        <PageRoutes />

    </>
  );
}

export default App;
