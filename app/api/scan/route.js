import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: "URL manquante" }, { status: 400 });
  }

  try {
    const domain = new URL(targetUrl).hostname;

    // Récupération de la liste noire en temps réel depuis PhishFort
    const response = await fetch(`https://raw.githubusercontent.com/phishfort/phishfort-lists/master/blacklists/domains.json`, {
      next: { revalidate: 300 } 
    });
    
    const blacklist = await response.json();
    const isMalicious = blacklist.includes(domain);

    return NextResponse.json({ 
      safe: !isMalicious, 
      domain: domain 
    });

  } catch (error) {
    return NextResponse.json({ safe: true, warning: "Scan incomplete" });
  }
}
