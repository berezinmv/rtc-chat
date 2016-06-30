export const PeerConnection: {new(...args: Array<any>): RTCPeerConnection} = (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection) as any;
export const SessionDescription: {new(...args: Array<any>): RTCSessionDescription} = (window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription) as any;
export const IceCandidate: {new(...args: Array<any>): RTCIceCandidate} = (window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate) as any;
