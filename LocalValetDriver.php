<?php

class LocalValetDriver extends LaravelValetDriver
{
    private $site_folder = "/public";
    /**
     * Determine if the driver serves the request.
     *
     * @param  string  $sitePath
     * @param  string  $siteName
     * @param  string  $uri
     * @return void
     */
    public function serves($sitePath, $siteName, $uri)
    {
        return true;
    }

    /**
     * Determine if the incoming request is for a static file.
     *
     * @param  string  $sitePath
     * @param  string  $siteName
     * @param  string  $uri
     * @return string|false
     */
    public function isStaticFile($sitePath, $siteName, $uri)
    {
        if (
            file_exists($staticFilePath = $sitePath . $this->site_folder . $uri)
        ) {
            return $staticFilePath;
        }

        return false;
    }

    /**
     * Get the fully resolved path to the application's front controller.
     *
     * @param  string  $sitePath
     * @param  string  $siteName
     * @param  string  $uri
     * @return string
     */
    public function frontControllerPath($sitePath, $siteName, $uri)
    {
        $path = $sitePath . $this->site_folder;

        define("PUBLIC_PATH", dirname(__DIR__) . "/plan-prise/public/");

        return strpos($uri, ".php")
            ? $path . $uri
            : $sitePath . "/public/laravel.php";
    }
}
