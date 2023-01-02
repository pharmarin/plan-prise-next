<?php
/**
 * Simple logger class based on a similer class created by
 * Darko Bunic (http://www.redips.net/php/write-to-log-file/)
 * Does simple logging to a specified file. See https://bitbucket.org/huntlyc/simple-php-logger for more details.
 *
 * @package default
 * @author Huntly Cameron <huntly.cameron@gmail.com>
 **/
class PHPLogger
{
  /**
   * log_file - the log file to write to
   *
   * @var string
   **/
  private $log_file;

  /**
   * Constructor
   * @param String logfile - [optional] Absolute file name/path. Defaults to ubuntu apache log.
   * @return void
   **/
  function __construct()
  {
    date_default_timezone_set("Europe/Paris");

    $log_file = PUBLIC_PATH . "/logs/debug.log";

    if (file_exists($log_file) && filesize($log_file) / 1024 > 1024) {
      $dirname = dirname($log_file);
      $filename = basename($log_file);
      $newname = $dirname . "/" . date("d.m.Y") . "_" . $filename;
      if (!rename($log_file, $newname)) {
        $this->error = 'Can\'t rename the old log file';
      }
      foreach (glob($dirname . "/*.log") as $logfile) {
        //ако има стари логове на повече от 1 месец
        if (filemtime($logfile) < time() - 30 * 24 * 3600) {
          unlink($logfile);
        }
      }
      file_put_contents($log_file, "");
    } elseif (!file_exists($log_file)) {
      file_put_contents($log_file, "");
    }

    $this->log_file = $log_file;

    if (!file_exists($log_file)) {
      //Attempt to create log file
      touch($log_file);
    }

    //Make sure we'ge got permissions
    if (!(is_writable($log_file) || $this->win_is_writable($log_file))) {
      //Cant write to file,
      throw new Exception("LOGGER ERROR: Can't write to log", 1);
    }
  }

  /**
   * d - Log Debug
   * @param String tag - Log Tag
   * @param String message - message to spit out
   * @return void
   **/
  public function d($tag, $message)
  {
    $this->writeToLog("DEBUG", $tag, $message);
  }

  /**
   * e - Log Error
   * @param String tag - Log Tag
   * @param String message - message to spit out
   * @author
   **/
  public function e($tag, $message)
  {
    $this->writeToLog("ERROR", $tag, $message);
  }

  public function ajout($tag, $message)
  {
    $this->writeToLog("AJOUT", $tag, $message);
  }

  /**
   * w - Log Warning
   * @param String tag - Log Tag
   * @param String message - message to spit out
   * @author
   **/
  public function w($tag, $message)
  {
    $this->writeToLog("WARNING", $tag, $message);
  }

  /**
   * i - Log Info
   * @param String tag - Log Tag
   * @param String message - message to spit out
   * @return void
   **/
  public function i($tag, $message)
  {
    $this->writeToLog("INFO", $tag, $message);
  }

  /**
   * writeToLog - writes out timestamped message to the log file as
   * defined by the $log_file class variable.
   *
   * @param String status - "INFO"/"DEBUG"/"ERROR" e.t.c.
   * @param String tag - "Small tag to help find log entries"
   * @param String message - The message you want to output.
   * @return void
   **/
  private function writeToLog($status, $tag, $message)
  {
    $date = date("Y-m-d H:i:s");
    $msg =
      $date .
      "\t" .
      $tag .
      "\t" .
      $status .
      "\t" .
      $message .
      "\t" .
      Auth::user()->old_user->login .
      PHP_EOL;
    file_put_contents($this->log_file, $msg, FILE_APPEND);
  }

  //Function lifted from wordpress
  //see: http://core.trac.wordpress.org/browser/tags/3.3/wp-admin/includes/misc.php#L537
  private function win_is_writable($path)
  {
    /* will work in despite of Windows ACLs bug
     * NOTE: use a trailing slash for folders!!!
     * see http://bugs.php.net/bug.php?id=27609
     * see http://bugs.php.net/bug.php?id=30931
     */
    if ($path[strlen($path) - 1] == "/") {
      // recursively return a temporary file path
      return win_is_writable($path . uniqid(mt_rand()) . ".tmp");
    } elseif (is_dir($path)) {
      return win_is_writable($path . "/" . uniqid(mt_rand()) . ".tmp");
    }

    // check tmp file for read/write capabilities
    $should_delete_tmp_file = !file_exists($path);
    $f = @fopen($path, "a");
    if ($f === false) {
      return false;
    }

    fclose($f);

    if ($should_delete_tmp_file) {
      unlink($path);
    }

    return true;
  }
}
?>
