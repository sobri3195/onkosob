import { useEffect } from 'react'

export function useDocumentMetadata(title:string,description:string,canonicalPath?:string,jsonLd?:Record<string,unknown>[]) {
  useEffect(()=>{
    document.title=title
    const set=(selector:string,attribute:string,value:string)=>{let element=document.querySelector(selector) as HTMLMetaElement|null;if(!element){element=document.createElement('meta');const match=selector.match(/\[(?:name|property)="([^"]+)"\]/);if(selector.includes('property='))element.setAttribute('property',match?.[1]??'');else element.setAttribute('name',match?.[1]??'');document.head.appendChild(element)}element.setAttribute(attribute,value)}
    set('meta[name="description"]','content',description);set('meta[property="og:title"]','content',title);set('meta[property="og:description"]','content',description)
    let canonical=document.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=new URL(canonicalPath??location.pathname,location.origin).href
    document.querySelectorAll('script[data-content-schema]').forEach(node=>node.remove());jsonLd?.forEach(data=>{const script=document.createElement('script');script.type='application/ld+json';script.dataset.contentSchema='true';script.text=JSON.stringify(data);document.head.appendChild(script)})
    return()=>document.querySelectorAll('script[data-content-schema]').forEach(node=>node.remove())
  },[title,description,canonicalPath,jsonLd])
}
