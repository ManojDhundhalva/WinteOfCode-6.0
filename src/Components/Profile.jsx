import React, { useState, useEffect } from 'react';
import DatePicker from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { useNavigate } from 'react-router-dom';

//new
import Button from 'react-bootstrap/Button';
import { useFirebase } from '../Context/Firebase';
import LogoutIcon from '@mui/icons-material/Logout';

import {
    getFirestore,
    collection,
    query, where,
    onSnapshot,
    updateDoc,
    doc
} from 'firebase/firestore';
import { Password } from '@mui/icons-material';


function Profile() {


    const db = getFirestore();
    const colRef = collection(db, 'User');
    const localEmail = window.localStorage.getItem("LocalEmail");
    const localPassword = window.localStorage.getItem("LocalPassword");
    // console.log('inside profile', localEmail)
    // console.log('inside profile', q)

    //new
    const firebase = useFirebase();
    const navigate = useNavigate();
    const handleLogIn = () => {
        window.localStorage.removeItem("ISLoggedIN");
        window.localStorage.removeItem("LocalEmail");
        window.localStorage.removeItem("LocalPassword");
        firebase.setIsLoggedIn(false);
        navigate("/login");
    };


    const imageURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFBgVFRUYGBgVGBgZGBgYGBIYEhgYGBgZGhgYGBgcIS4lHB4rHxgYJjgmKy8xNTU1HCQ7QDs0Py40NTEBDAwMEA8QHhISHjQrISE0NDQ0NDQ0NDQ0NDQxMTQ0NDQxNDQ0NDQ0NDQ0NDQ0NDQ0MTQ0NDQ0NDQ0NDQ0NDQ0Mf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA+EAABAwIDBQYEBgECBQUAAAABAAIRAyEEEjEFQVFhcQYigZGh8BMyscEUQlJi0eFyFbIjgpLC8QckM0Py/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAJhEAAgIBBAICAwADAAAAAAAAAAECERIDITFBE1EEIjJhcUKRof/aAAwDAQACEQMRAD8A9DYUVpQ2tRWtSAmCpBRa1EAQAwTqUJIAZOnVXH4+nRZnqvaxukuOp4DiUAWYTwuPf/6hYXMQBUIE94NbBjeLq3h+2+CeY+IWn97HAeYlFMVo6YBShYh7TYUGPjN6gOLfMCFp4bFsqNzMe17eLSCEDJ1DCw9p4sN3q/j6hAK5TaFMvmSoci4xMraeKzGyxst1rnBkmEN+DjclZpRSbpqg4mqQFPFHK0obHZ2hFhRUwb3veuywFNwErmsGzI/qunwryQhsKNPDu5q+2oAFRossrlHDEoTIaKtd5cYCu7PpQjs2erdChCaJZapiykQpManhWTQEhLKiwlCAoEGp8qJCUICgeVCrMMKyUN70WFGDjGu0WFjtll911OKgrPq12t1UtlJHGHZjhuSXRVMSyTdJGQ8Tq2hTXEu7Ws/UPNJva1h0cEWLE7dpClIXDO7XMH5ghDtoyfmRbDE9AClC42h2sYfzDzV2n2lYfzDzRY6Oie4NBJIAAJJOgA1JXinbbb/4rEHK4/Dpy1g3SbF/j/C6btr2mL2fApugOGao8RZm5vj9l5fnETxJN7CxgfQcwtIrsym+iXxL2PkSiCpbgePvXd70Bn92n3x8CnJ+/s9P7VGZbp4lzT3XG3DT3da2zO0dag6Wu8bA+NoPiufze9/Hz38+qlnvu97/AO55W3oo9Jo9sviNh4E/qFvMbvBU8Rt6DDrcOB5hcRSrR7/pX6eMBGV928JFuJHBZygmaQ1GuTqsNtRrjMo1fHNK43E4chuemS4C5H5gOPNZrNrOBmTZRizbNHS7SfmBQsDVhoWI/a0i51Uae0CBYophkrOwwNIOeCV09BrWiy4LZm07iSu12ZiRU0UMtUzUw2IJMLocCLLLw2FGq0aTg1OLJkjTACcMWcce0alWqGKa7QrRSRm4sswlCbMExeE7FQ6UJmvBTosKFCSUp0WFESEKoxGUHpBRm1qKwtq0Z0K3cXiA3UrLqNzlQ2ioxZzH4R36kl0P4XkklkXR4gKxUm4khUfiJF66aOWy67EE71H4yph6migstioeKs4R73vDA431ubAXJ8lm54V7Zru498xYMB/yu70A80qHdFjaeLkkCw6gaWieg9Fl4YEt00JHDed27gj4iq1s73ekwYFuYVc4gx9I4A5gI6FURyWA33xMSOtp8kmxGvCDyOhHMGyr5jeNRp1F2jhpCKI8D5lrv7SKoITy0Gn2nyITA8es9bZhyO8JhPjpO7MND49NFKbWG6QPHvNPv6JAIe779QAT6IzHHd943eWn24IIP8dQT3T1BtruUg7jz8/zDoRJ3IsdFzD1iCCD7+vvzjj9nNqgvZZ+pbENf0tY/VCa73xtbTiLdQOCMx/MnoOMXv1HnySsKo5wggwbEag6qbFtbUwecfFaO8IDwBOYbnQN/wD5WKLFBSLdKqW3XS7B2+WWcuVBTtdClxspSaZ6/hO07MvzBDx/a5jROYea8jdWPEoD6xO8qVplPV/R2u1O2bnfJIWv2U7ZE915uF5aXotCuWmQYVOCohTd2z6Ef2lYGzKxcX23YJ7wtzXlP+tvLYJWbXxJcZJUqD7KlqLpHueye2LHicwW3T7RUz+Yea+csNjXs+UwrNLa9RjsweZ6p4PpiWou0e+YjtNTabu1Vlm32ETmC+esTtqo8gl0RwV2l2iqQATolhL2PyR9HuL+01MH5gk/tLTLfmHmvCMTtl50cVT/ANXqxGcowl7DOPo9N292vDagaCTfdC09ndomloJO5eKOrEmSZPFHbtKoBAeQE3pAtX2j3P8A15n6gkvC/wDUqn6z6JKfE/Y/KvQUQouKCHFRe4rcwLLCETOFRa4okO4IAnWetDD1MuHZ+57neRyj6LLNNx3K9iLNY39LB6yUIGVXuJPj4WP9FSZA8I6b2+OoQyffX/8ASkHT42597+/qmAUPPl5y03jfcH1RWuGm648DcEDTl4qtm39D9ne+im0bureA4tPvgkBaDp1OtjyI0PBSDjrv1HHMLOHLwVdr5/5h5Obp7KfPe15IcBab2cI96lSUWM48N+vyuTZz4+V26+YtZBi1zuMREkA6X0PipB8XaI0dJ1I0PUanXggCy2egtflIynwMorajY+24ASDxsA63LkqoZuJ0JHgflMeQRWHlefCRYjxjikMtsqO3OI4xbhJv4f8AUs/bVI52v1Dxc/ubrPhCtNf49bSI7oO/QkeIVljQ9pYbzdpv8w0IPMfVFhRz0GFANct5uACI3AtUeRGniZzppuUTRPBdP+Cal+Dajyj8TOWGHdwRBhHcF0zcI0IoosR5Q8JzDcC4qY2Y5dO1rU4c3gl5GPwxObbshymNjuXR/GbwUXYpvBLOQeOKOeGxyit2OVtHFt4IbscE8pCwiZp2Os3GYAsXR/jgqeMrBwTjKVilGNbHNhhSyK5UgKs591qmY0R+EmRfipI3GbTdnBJ2zZWlmTgrDNm604lGlssBW27OajNejh6lyZcYxK7dntWTtuiGuHNoA4WJW78VY3aB05D1H0/lVpN5Ea0VjsYjj7+n0CQ/8ehH3UM3v30CkKbo0jrbSSLa8Quk5gjXCeU+jh/P2U2ifod8OGnLkh90b82o5QdCPHmiEk2NgbQNzhoRuEpDQSOJ1O6bOH7vNIOmzbWkazI16/2ohs34jfFnN3X92KkOI/yHWO8L++8Ehjt48IcOh1iPE+SIIGmg1/xdz5fZD+gM8sruu6f9qmBx0bYzoWnQ3tv+qQyY4HjkP1aY435aqTHnxN7fqbqB1H0UQ3if2k/7XT71Sc/zN+eZvrcW3pDCtPAxOh0sTLSfHpqj0X5SCLRfQADQxJvvA8FPCbMrVPlblbxdaxg2GtpO4Kxjdk/Cbme8uOYCIDW3BPXdxWb1I3V7mq0ZtZVsSrVRJhC/EKu58qBCmkPJll2KTNxKqEJJ4onJlt2JQ3YlAShFIHJhvxKRxCFkUHMTpCykEdWUDVQ8qYtVUiW2SNVBfUT5VEsRsTuRNYobqpRDRS+AnsG5UqOJQSFofh0xwyrJCpmdCSv/AIdJPIKN8FFBUmUEzmLmtHTTHYFIlMDCk1ylsuKBjVZ22sU0ZWFgMXBM7xc292Wk7VZ23GhzWHhmG7ktNJ/Yy1lsYpr7mgDoAOP8qBJOu/2PVTcwe+n9pufj5Q7+V0nMIDy4cj/f3U2ndxt4tuDHqmDTw4jwInX3vSAt1E+I1+yAsnn4amCORGot5eakHb5/cON9fWT5ILngadR9x6oT6vD3OoSA0sIzM7Lw1jUtO6fTzXe7K2RhwwPcwAxF5J8yuW7N4IgBzh80GbEAflEjTpzXQ9ocWKdHK096O7GuY6R4wuLWlJyUYnp/G04KGUjUxOLoNbZojnEGYAHnC5za2y302nE4ZjSzV7IEt4uadw4jdr0q7K2bVec9Zxc4mQ0/K3mQLT9F2LMIw0jTc9zM4IOVxaSCIKz/AAlu79nRJKcPrGn17OCweIxJcC54ADgSy7gYM5SJiFvbEwDBUGbM5rgcwe972lsE3BMHSdFLG7Er0yC1zKtNrTlMU6b2AXghoAd11VjZeMoU8z6r4DBAmAC91g2NSYzGB+ld0XCUbieRNakZVI0NobFwz25WhlNw0LAAb/qaNRcarJxPZmnToGq7FUwQDlY6GOceABdm4aA6rbO2aMBzWDvaZ8rXvGthVIJHPRYO1du0cQ3JVw73Ma7McvwwWloIkFjo5WOkpOn0NWuzmnm/NMCtPGUKdR//ALcsDA1mUS/MZEkkmS43uq+LwL6fzCx0cJLek7j1WbdOjVRbV9FSU4USEkCoIXqBcmhIBADFOFJRBTsmiYYkaadrlMvSseKBimkWJ86jnTJaGDFF7UTMoOcmKiGRJPmTpgb4fZVy+SiinZVqrQ25Me9ywOjeibyoh3NAfimgDW/Iz1hZ2NxxNmuEci0Hpr9VajZLdGnVrXO7mgY9zS1rZ0kngJj6LBe9x/MfMkBDdWd+olawio7mGpJy2LrmD1/nh/j6oZLR4Ef7bHzVQvcb+/dz5qMrUzosurj6eYsgvqk/XmoQkgdCJRsKzM4NGriAEFaGxQM5O8CB46n09VMuCoq5I6vAVDQh+b5QAGuzFsDRstIdH7QY5FCwOCe95q1TJJJa22VoJ3AAQforOFp5yBw14rocJhW+AXDOWP8AT1dOKlv0guCpBrZMBcvt3abhXa1jfiA3cN3IA+Z8lrbZY+rLGOLWmAcvzGNRO4FNszZbWjSOJN3GBqSblYxpfaX+jb7f4uv2Nhsc8Mgtygi5JBaDwtvXOY7abfw7HFoc91Wq5hMkNtTGcNJgkZbTOvVdViqtOSwES4R47oXmmNcQG03a0i8HqX38IC6fi1bo5fncRf8ASdSvNmuJc8S9zpJcZ+WSPltfj0QTWcW94nI2O7IAJOgtrvPQIRcb/LeARaecDqiub3KbBq8ud4l2Qf7D5rrs8yrHcHZM5LQCYaDdzoMEtEd0DjbTetzYu3KtMMFUh9GoS2XHMWkWhx3WgwdxBWPjsoLrgmwZAiGgQCQOXqSh4QyyowugFmcAkAF7DbXflLxA1lS0prc0i3pvY2XxmMaSY6Tb0Ttaq+HuxpOuUfRHYFi1RsnZMgBCc5J5KiKZQhNiJQ5RgxP8JMQIFOp5VPLZAIA5yiDKd7E7GFMkiQnKJlQaiYNEJSQ5Tp0SdNUxAbM35WWLicW1zsx0GguR1jfdDqPmbd0cLBxHFVDVkwBxJM35myiMTWUwWJq5jaw8h4KAEDNM8Nbz1SdV3NaOHGOiT2ADM8yf0+9FrwZc7gHG3Uz79VEDek98mUnFWQxxdRT6eKZACSOiSUoAS0dlGMzvD35rNV/Z5sev2CmXA4fkdJsXFFrnTvW/hcQXuygxxPBcdRq5Vp4HEubJG9cU47tnq6UrSR2mHpNi1/qs3a9esJbRpyY+YnK0Tv5+Cr7O2oZAI1W6+DvC52qds3Rx1DBYjMX1C0kxpNo3AWhctt5pFd5O8ieuVs/X1XoO0tp0aJgkFx0bvM7+i4btG7NVmLuaH+JkEeTR5Lq+O3ldco5/mU9JK+GZG7d1m/lwU6VTvMJ0YR5Zi4/UqAKZdp5RbpYXOYblGUHM4mxhxhwHCPpzVnAsgVHAAhrC24JBLzlEX1iY6KsDTcwQSx47rhq17bkOmbGwBbpoRvC1dm4T4zmsY1wY0h1RzvzOuNBFoJA3iSpk6Tb4KjFzaSW5tYnY7/hUnsYbs7zQLiCQCBv03cOqzWLvcEH5Q1zpifyxMknid5K5rbeB+HUJ3Plw5Sbjz+oXHGeTo7tTSx3Md7FNrFOEskLQxIBicsT51NrwgWxXcxSYyUSqQh0n3T6DZMd7IQi4I9V0oAZJSQpfoQhBqsRnMhMQqQmU/hJ0ZJVZFFXFVug5dNFTpyGmNXwB/iNStCphWAlznEydLx5rPxGKkw0QNE4u+ByVbshmDev0QXOJ1UmNLjbx/tO0ZZtc6fyr4M+f4DISCcj0TKhCCRSKSAEEkgkgBldwGh6/YKkr2DHdnmVMuCofkaDBotCmICpUhMLQpNK45np6RbwzNCNy1mYgNgPflB3mD9VTwlLyTdqKsUMrTDnWGkxvi1hu8VjWUqOiTxjscw7FsqVX1XABrY7skiAIBaDOpExoC6yycViM7nOIgk21gDcPJCJ4pgvRjBRdnkT1nJYvr/rFCaESm2bIraBaZc0kclTlRmo2Sp0WmABLnczYdOK6zB1m4Onnn5iABxJO4dJPguRw9QtfI3eavY2uKlbXutDWiTLZ3xOl/osNSLk0nxydmjOMItqrbo9B2Htn44JsOAkep+wWb2jrZqrKebv5XFrf1XuAeNtN6ysHtGmwZWObPGY8D3SfJD2niSz/AIxdmqPhrCRAY2ZJaJ117xvwAWWnpVO+i9fWi40mM0b1MvCtY4NkvbEOO7SSA6R5nxBWa9y0o5kEcEImEwqKRIQJgn1EzaikWSovp2T2JphW1BCTKwBVcMKYMKdILZZr1whfFkIT2JtEJCbZLOkhynVUKyhiqxedTCqkIhBP1/sqIpE6acdytUiXbLr4Y1rBvAc89d3kqVUmYVjEPmTxjyaAB6hV6vHilEqb6ItCbMnaUxCsgRTuKYpkAOEoS3e+SRQAgFrYGkCIyuIEmc7R/wBpWUwXW5s6jN8xAMXm0++aKT5JcmnsaNLBQRBcN/ebI/6m/wALTw+HBFiDzBBHposzGYllO5MvAtqAeEgqjs57xLy6C4zIMG+6fssZ6Klwzp0vluGzVnYtpFoXH9pNo5q5a02Y0NndmNzHmB4LXftqBlPekRmBbnDjp3dHahZruzzR3i55vJ+WRPGx3lZ6ejg7kba3yc4/TY51zJk8NfGVGm697rp27Ep/NmeQRH/1+tlzmMptY9zWkkAkAmAfRdKafBxNNcj0Q2fmdPIAXneVdNSRAHDUk/0s3gfcopqR7sk42NSaRPHMLY+wA+irMCJVfIuVCkRN1SRLdmjgIBn36rXxrBUo5QQSBvPC9hzWNhy4/Ix7tNAYnr4LUobML3Br3BgIsxpBqE73GLbjxUtdjT6G2Lic7DRcYLXZuZtE9dAeJy8ypYii5jsrvA7iOI5KptDB/BPxKbS3I6O8c2cOG8eMEcCtWpVFWmXg3BD/APlfDT6tg8xP5lEl2aRl0Z6i95Uxqk8KSiLCdUUvQmvClTbdFCyHc1SptKPaFEuCVjrcE9qrvYjl6r1qkqkQyMJ0LMUkwK2Gol4kzE7t/JEr1Wttw0CPiXBjA0bmj19lZBM3RFZO+i5PBUuR3vJSATBS/L4rXgx5GITJw60JkAKUySSAHTJ0yAD4ZhLre9/2Wxgc1L/42lx398Njo0iB5lUNnEAi4m5uHGNBeBwlb2CLWtJ1DZLiw5iB+5uo8k+jN8mTtXBuEPOd2b5pAOTkSNfCym5tMtaRDwSQGgvaZHHh5om06md+Vju5kzEtJLQOm4aI2HwbarA4Q14kZmgZXAfqjfzSafKZUWuGirQw7HugtDCNHsLobwzBxNtLhWcZia7HBjzds5HgfM0i08RyRRgHta/OAQWlodmbq4QIn5jyso7Nwrw85wXMpwSHGBmAGRpB3k/RRfTLxS3TNrEPGS7QDlAOUHLmAEn1XD1yHDMCJEzeDE8Cuwx2drT3XukSSA2C4zYfyuGhVFUJu2SCm1rTx8AAEMFSKokM9rQCAy+skzbkOKHQe4E5dSN11YdlgOaQIN+7MSN5AnUH0Q8Mw54EEmeh328kijQxNRz2NGZwLb3hoJ36mTadAVaJbLXiQ4AHNcNMbszhPhlVanhKsZQMo1sGjpOXW0jxRjs+2YkkxBIJdPMJUKy47Fsqte2BnjL38wa8EgWd8wvxgeMLPpP+DXbTcf8AhuncM7W1G5Tf9rgDHFsrRZSEBwF73g2kb5/xPuVndpqcuY8aOZlPItv9HeiKBSCupw4tOrSR4gwrHw5Cq1KsljiSczGOM6zlDXerSfFWKFaVizZMBUpkKHxoWk+IWViacmyadktUwrcRKk56r06UaohMIpD3B1KiqZ7q1VgqsWKkSyXxEkOEkUgsFiKxc0Dp6BV0klUeBSdvccKSSSoQyYJJIARCZJJMkSkxpJgJJIQ3wa2zMNlqMLyCC4AiCQSdB5xdDx5yOY5jnQ4G8kH53THAWTJJshFihFYGAHOi/wCSp/1Duu8Qrex6wa7IO/8AtPde09flPmkkk+A7OjIZVsWyM0N4hxFzyhZL8QDWFJhinTNy6S5zhpPIJJLJdmsuEGxlc5nkO7rWkAR+YESfJcORYJJK4ksZSJSSVCGaSNCpU3d4E+PRJJIo2GPLYIcSNOnHp4LQc85ZjWSd8kE+sCJ5pJIJCsqyOYv1BE38Ppu0QNttBw5/a8EeJII98OiZJAIq1KfdZypsvvu3N/3ITX5Uklk+TRcBDiDCA7EJ0k0kDYm4hRe+U6SkfQB1RSBSSVkIaEySSAP/2Q==";
    const today = moment();
    const currentDate = moment().format("DD-MM-YYYY");
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const disFutureDate = (current) => {
        return current.isBefore(today);
    };
    const handleDateChange = (date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY");
        setSelectedDate(formattedDate);
    };

    const [updated, setUpdated] = useState(false);
    const [DocId, setDocId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name2, setName2] = useState('');
    const [name3, setName3] = useState('');
    const [name4, setName4] = useState('');
    const [isValid2, setIsValid2] = useState(true);
    const [isValid3, setIsValid3] = useState(true);
    const [isValid4, setIsValid4] = useState(true);
    const [gender, setGender] = useState('male');
    const [AddressField, setAddress] = useState('');
    const [selectedState, setSelectedState] = useState('');

    const handleNameChange2 = (event) => {
        const inputName = event.target.value;
        const isValidName = /^[a-zA-Z]+$/.test(inputName) && inputName !== '';
        setName2(inputName);
        setIsValid2(isValidName);
    };

    const handleNameChange3 = (event) => {
        const inputName = event.target.value;
        const isValidName = /^[a-zA-Z]+$/.test(inputName) && inputName !== '';

        setName3(inputName);
        setIsValid3(isValidName);
    };

    const handleNameChange4 = (event) => {
        const inputName = event.target.value;
        const isValidName = /^[a-zA-Z]+$/.test(inputName) && inputName !== '';

        setName4(inputName);
        setIsValid4(isValidName);
    };

    const handleGenderChange = (event) => {
        const selectedGender = event.target.value;
        setGender(selectedGender);
    };

    const handleNameChange8 = (event) => {
        const inputName = event.target.value;
        setUsername(inputName);
    };

    const validatePhoneNumber = (input) => {
        const value = input.replace(/\D/g, '');
        const isvalid = /^\d{10}$/.test(value);
        setIsValid(isvalid);
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setPhoneNumber(inputValue);
        validatePhoneNumber(inputValue);
    };

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
    };

    const UpdateProfile = async () => {
        if (isValid && isValid2 && isValid3 && isValid4) {

            const docRef = doc(db, 'User', DocId);
            await updateDoc(docRef, {
                FirstName: name2,
                MiddleName: name3,
                LastName: name4,
                UseName: username,
                EmailId: email,
                isMale: gender,
                Address: AddressField,
                ContactNo: phoneNumber,
                State: selectedState,
                DOB: selectedDate,
            })
                .then(() => {
                    console.log('updated..', DocId);
                })
                .catch((error) => {
                    console.error('Error updating document: ', error);
                });
            setUpdated(!updated);
        }
    };

    useEffect(() => {
        const q = query(colRef, where("EmailId", "==", localEmail));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let books = [];
            snapshot.docs.forEach((doc) => {
                books.push({ ...doc.data(), id: doc.id });
            });

            if (books.length > 0) {
                console.log('books', books[0]);
                setName2(books[0].FirstName);
                setName3(books[0].MiddleName);
                setName4(books[0].LastName);
                setUsername(books[0].UseName);
                setEmail(books[0].EmailId);
                setGender(books[0].isMale);
                setAddress(books[0].Address);
                setSelectedDate(books[0].DOB);
                setPhoneNumber(books[0].ContactNo);
                setSelectedState(books[0].State);
                setDocId(books[0].id);
            }
        });

        return () => unsubscribe();
    }, [firebase.isLoggedIn, updated]);


    return (
        <>
            <div className="container mt-5  ">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4 text-center">
                        <div className="card my-4">
                            <img src={imageURL} className="img-fluid" alt="/images/image4.avif" />
                            <div className="card-body">
                                <h5 className="card-title">
                                    YOU
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    @{username || 'USERNAME'}
                                </h6>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    {email}
                                </h6>
                                <h6 className="card-subtitle mb-2 text-muted dark">
                                    {(isValid && phoneNumber.length === 10) ? '+91' + phoneNumber : 'YOUR MOBILE No.'}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card my-4">
                            <div className="card-body">
                                <h2 className="card-title">Profile</h2>
                                <div className="my-4"></div>
                                <div className="my-2">
                                    <label htmlFor="formGroupExampleInput" className="form-label">First Name</label>
                                    <input type="text" className="form-control" id="formGroupExampleInput" defaultValue={name2} placeholder="First Name" onChange={handleNameChange2} />
                                </div>

                                {(!isValid2) ? <p style={{ color: 'red' }}>Please enter a valid name containing only letters.</p> : <p style={{ color: 'green' }}>Valid.</p>}

                                <div className="my-2">
                                    <label htmlFor="formGroupExampleInput" className="form-label">Middle Name</label>
                                    <input type="text" className="form-control" id="formGroupExampleInput" defaultValue={name3} placeholder="Middle Name" onChange={handleNameChange3} />
                                </div>
                                {!isValid3 ? <p style={{ color: 'red' }}>Please enter a valid name containing only letters.</p> : <p style={{ color: 'green' }}>Valid.</p>}

                                <div className="my-2">
                                    <label htmlFor="formGroupExampleInput" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="formGroupExampleInput" defaultValue={name4} placeholder="Last Name" onChange={handleNameChange4} />
                                </div>
                                {!isValid4 ? <p style={{ color: 'red' }}>Please enter a valid name containing only letters.</p> : <p style={{ color: 'green' }}>Valid.</p>}

                                <div className="my-2">
                                    <label htmlFor="username">Username:</label>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                        <input type="text" className="form-control" defaultValue={username} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" onChange={handleNameChange8} />
                                    </div>
                                </div>
                                <div className="my-2">
                                    <div className="mb-3">
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" className="form-control" id="exampleFormControlInput1" defaultValue={email} disabled />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="gender">Gender:</label>
                                    <div className="d-flex justify-content-between" id="gender">
                                        <div>&nbsp;</div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                label="Male"
                                                value="male"
                                                checked={gender === 'male'}
                                                onChange={handleGenderChange}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                label="Female"
                                                value="female"
                                                checked={gender === 'female'}
                                                onChange={handleGenderChange}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Female
                                            </label>
                                        </div>
                                        <div>&nbsp;</div>
                                        <div>&nbsp;</div>
                                    </div>
                                </div>

                                <div className="my-2">
                                    <div className="mb-3">
                                        <label htmlFor="address">Address:</label>
                                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" defaultValue={AddressField}></textarea>
                                    </div>
                                </div>


                                <div className="my-2 w-50">
                                    <label htmlFor="dob">Date of Birth:</label>
                                    <DatePicker
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat={false}
                                        isValidDate={disFutureDate}
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        inputProps={{ readOnly: true }}
                                    />
                                </div>

                                <div className="my-2 w-50">
                                    <label htmlFor="username">Phone No. :</label>
                                    <div className="my-2">
                                        <div className="input-group mb-1">
                                            <span className="input-group-text" id="basic-addon1">+91</span>
                                            <input type="text" className="form-control" defaultValue={phoneNumber} placeholder="9900990099" aria-label="9900990099" aria-describedby="basic-addon1" onChange={handleInputChange} />
                                        </div>
                                        <div className="mx-3">
                                            {(!isValid || phoneNumber.length !== 10) ? <p style={{ color: 'red' }}>Please enter a 10-digit number.</p> : (<p style={{ color: 'green' }}>Valid</p>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-4">
                                        <label htmlFor="inputState" className="form-label">State</label>
                                        <select id="inputState" className="form-select" onChange={handleStateChange} value={selectedState}>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button className="btn btn-success my-4" onClick={UpdateProfile} type="submit">UPDATE</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >



            {/* new */}
            {/* <Button onClick={handleLogIn} variant='danger'>
                {firebase.isLoggedIn ? <p>LogOut</p> : <p>//</p>}
            </Button> */}
            <div className="container mt-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4 text-center">
                        <Button variant="danger" onClick={handleLogIn} className="mt-3">
                            Logout
                            <LogoutIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;