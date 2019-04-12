var google_analytics = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-135921114-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-135921114-4');
</script>
`;

var config = {
    site_title: 'Using the Redis Enterprise operator',

    analytics: google_analytics,

    variables: [
        {
            name: 'jupyterhub_namespace',
            content: process.env.JUPYTERHUB_NAMESPACE
        },
        {
            name: 'jupyterhub_application',
            content: process.env.JUPYTERHUB_APPLICATION
        }
    ]
};

module.exports = config;
