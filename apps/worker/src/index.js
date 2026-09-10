export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Not Found", { status: 404 });
    }

    const originUrl = `${env.ORIGIN_URL}/search?${url.searchParams.toString()}`;
    return fetch(originUrl);
  },
};
