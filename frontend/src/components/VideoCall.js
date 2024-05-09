// VideoCall.js
import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function randomID(len) {
    let result = '';
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length;
    len = len || 5;
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}


function VideoCall() {
    const { roomID } = useParams();
    const appID = 1492563618;
    const navigate = useNavigate();
    const serverSecret = process.env.REACT_APP_SERVER_SECRET;
    React.useEffect(() => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: document.querySelector('.myCallContainer'),
            sharedLinks: [
                {
                    name: 'Personal link',
                    url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, 
            },
            onReturnToHomeScreenClicked: () => {
                navigate('/'); 
            }
        });

        return () => {
            zp.destroy(); 
        };


    }, [roomID]);

    return (
        <div
            className="myCallContainer"
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}

export default VideoCall;