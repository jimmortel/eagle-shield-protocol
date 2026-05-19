"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createWalletClient, custom, parseEther } from "viem";
import { base } from "viem/chains";

function AntivirusContent() {
  const searchParams = useSearchParams();
  const urlToChain = searchParams.get("url");
  
  const [status, setStatus] = useState("payment_required"); 
  const [loading, setLoading] = useState(false);

  const MON_ADRESSE_RECEPTION = "0x872bD846596Cc1aEde8Fd800997d242e3473fA83"; 
  const PRIX_ACCES = "0.001"; 

  const gererPaiement = async () => {
    if (!window.ethereum) {
      alert("Web3 Wallet not found. Please install MetaMask or use a Web3 browser.");
      return;
    }
    
    setLoading(true);
    try {
      const walletClient = createWalletClient({
        chain: base,
        transport: custom(window.ethereum)
      });
      
      const [account] = await walletClient.requestAddresses();

      const hash = await walletClient.sendTransaction({
        account,
        to: MON_ADRESSE_RECEPTION,
        value: parseEther(PRIX_ACCES)
      });

      console.log("Tx Sent successfully:", hash);
      setStatus("scanning");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed or rejected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "scanning" || !urlToChain) return;

    fetch(`/api/scan?url=${encodeURIComponent(urlToChain)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.safe) {
          setStatus("safe");
          window.location.href = urlToChain;
        } else {
          setStatus("danger");
        }
      })
      .catch(() => setStatus("danger"));
  }, [status, urlToChain]);

  const terminalStyle = {
    backgroundColor: "#050d06",
    color: "#39ff14", 
    fontFamily: "'Courier New', Courier, monospace",
    minHeight: "100vh",
    padding: "20px 15px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textShadow: "0 0 5px #39ff14",
  };

  if (status === "payment_required") {
    return (
      <div style={terminalStyle}>
        <div style={{ maxWidth: "650px", width: "100%", border: "2px solid #39ff14", padding: "20px", backgroundColor: "#020702" }}>
          <h2 style={{ textAlign: "center", borderBottom: "2px solid #39ff14", paddingBottom: "10px", margin: "0 0 20px 0" }}>
            🦅 EAGLE SHIELD ANTIVIRUS V1.0.0
          </h2>
          
          <p style={{ color: "#ffffff", textShadow: "none" }}>&gt; INITIALIZING SECURITY PROTOCOL...</p>
          <p style={{ color: "#ffffff", textShadow: "none" }}>&gt; STATUS: GATEWAY LOCKED</p>
          
          <div style={{ margin: "25px 0", padding: "15px", border: "1px dashed #39ff14", fontSize: "0.95rem", lineHeight: "1.4" }}>
            <span style={{ fontWeight: "bold" }}>[ SYSTEM DOCUMENTATION ]</span><br/><br/>
            This extension acts as a Web3 firewall. When you interact with suspicious frames or untrusted links on Farcaster, Eagle Shield intercepts the request in real-time.<br/><br/>
            It cross-references the destination domain with active global Web3 blacklists (PhishFort, malicious drainer databases) to protect your funds BEFORE your wallet can sign any corrupt smart contract.<br/><br/>
            <span style={{ color: "#ef4444", textShadow: "none" }}>WARNING:</span> One wrong click can drain your wallet. Activate the shield to proceed safely.
          </div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button 
              onClick={gererPaiement} 
              disabled={loading}
              style={{
                backgroundColor: "transparent",
                color: "#39ff14",
                border: "2px solid #39ff14",
                padding: "12px 24px",
                fontSize: "1.1rem",
                fontFamily: "'Courier New', monospace",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 10px #39ff14"
              }}
            >
              {loading ? "COMMUNICATING WITH RPC..." : "> ACTIVATE SHIELD (0.001 ETH)"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "scanning") {
    return (
      <div style={terminalStyle}>
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          <h2>[ RUNNING NETWORK SCAN ]</h2>
          <p style={{ fontSize: "1.2rem" }}>C:\\EAGLE_SHIELD&gt; Analyzing destination metadata...</p>
          <p style={{ color: "#ffffff", textShadow: "none" }}>Checking signatures, smart contract integrity, and phishing blacklists.</p>
        </div>
      </div>
    );
  }

  if (status === "danger") {
    return (
      <div style={{ ...terminalStyle, backgroundColor: "#1a0505", color: "#ff3333", textShadow: "0 0 5px #ff3333" }}>
        <div style={{ maxWidth: "600px", border: "2px solid #ff3333", padding: "30px", backgroundColor: "#0b0202", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", margin: "0 0 20px 0" }}>🚨 THREAT DETECTED 🚨</h1>
          <p style={{ fontSize: "1.2rem", color: "#ffffff", textShadow: "none" }}>
            C:\\EAGLE_SHIELD&gt; CRITICAL_ERROR: MALICIOUS_TARGET_DETECTED
          </p>
          <p style={{ marginTop: "20px" }}>
            This link or Mini-App is flagged as a Wallet Drainer / Phishing campaign. 
          </p>
          <div style={{ marginTop: "30px", padding: "15px", border: "1px dashed #ff3333", color: "#ffffff", textShadow: "none" }}>
            <span style={{ color: "#ff3333", fontWeight: "bold" }}>EAGLE COUNTER-MEASURE:</span> The connection has been forcefully terminated. Your assets are secure. Close this tab immediately.
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function CheckPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#050d06", color: "#39ff14", fontFamily: "'Courier New', monospace", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        LOADING EAGLE BOOTLOADER...
      </div>
    }>
      <AntivirusContent />
    </Suspense>
  );
              }
