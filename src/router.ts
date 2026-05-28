import type { Fetchable } from 'astro';
import { FetchState, astro } from 'astro/fetch';

export default {
  async fetch(request: Request): Promise<Response> {
    const state = new FetchState(request);
    const response = await astro(state);
    
    if(response.ok || (response.status >= 300 && response.status <= 399)) {
        var url = new URL(request.url);
        if(url.pathname.startsWith('/trainingen')){
            const [_, code, title] = url.pathname.split('/');
            if(code == 'AZ204') {
                return new Response(null, {
                status: 302,
                headers: { Location: `/trainingen/AZ400/azure-400` }
            });
            }        
    }


    }


    return response;
  },
} satisfies Fetchable;