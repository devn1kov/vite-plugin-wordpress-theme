export const getFunctionsPhp = (assets: string[]) => {
  const cssFiles = assets.filter((fn) => fn.endsWith(".css"));
  const jsFiles = assets.filter(
    (fn) => fn.endsWith(".js") && fn.split("/").pop()?.startsWith("index"),
  );
  const content = `
  <?php
  add_action('wp_enqueue_scripts', 'theme_enqueue_scripts' );

  function theme_enqueue_scripts() {
    wp_enqueue_style(
  		'wp-headless-theme-css-main',
  		get_stylesheet_uri()
  	);

    ${cssFiles.map(
      (uri, i) => `
      wp_enqueue_style(
    		'wp-headless-theme-css${i}',
        get_parent_theme_file_uri( '${uri}' ),
        array(),
        wp_get_theme()->get( 'Version' ),
        'all'
      );`,
    )}

    ${jsFiles.map(
      (uri, i) => `
      wp_enqueue_script_module(
       	'wp-headless-theme-js${i}',
       	get_parent_theme_file_uri( '${uri}' ),
       	array(),
       	wp_get_theme()->get( 'Version' )
      );`,
    )}

  }`;

  return content.trim();
};
