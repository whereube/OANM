import { useContext, createContext, useState, useEffect} from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("sessionId") || "");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const initializeUser = async () => {
            const storedUserId = localStorage.getItem("sessionId");
            if (storedUserId) {
                setUser({ userId: storedUserId });
                setToken(storedUserId)
            }
            setLoading(false); // Finished loading
        };
        initializeUser();
    }, []);


    const loginAction = async (data) => {
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData.message);
            } else {
                const res = await response.json();
                if (res && res.email === data.email) {
                    setUser({ userId: res.id });
                    setToken(res.user_id);
                    localStorage.setItem("sessionId", res.id);
                    return { success: true };
                } else {
                    throw new Error(res.message);
                }
            }
        } catch (err) {
            return ({ success: false, 'message': err.message });
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("sessionId");
    };

    const checkIfAdmin = async () => {

        
        if (user === null){
            return false
        } else{
            const userid = {"userId": user.userId}
            try {
                const response = await fetch(`${API_URL}/user/isAdmin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userid),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData)
                    console.error('Error:', errorData); 
                    throw new Error(errorData);
                } else {
                    const res = await response.json();
                    return res
                }
            } catch (err) {
                console.log(err)
            }
        } 
    }

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, checkIfAdmin }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


