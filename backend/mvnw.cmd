@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, version 3.2.0
@REM
@REM Required ENV vars:
@REM   JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM   MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM   MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM   MAVEN_HOME - path of your Maven installation
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET ___MVNW_UGLY_FQDN=org.apache.maven.wrapper.MavenWrapperMain
@SET __MVNW_PROJECT_BASEDIR=%~dp0

@IF NOT "%JAVA_HOME%"=="" (
  @SET __MVNW_CMD="%JAVA_HOME%\bin\java.exe"
) ELSE (
  @SET __MVNW_CMD=java.exe
)

@%__MVNW_CMD% -classpath "%__MVNW_PROJECT_BASEDIR%.mvn\wrapper\maven-wrapper.jar" ^
  "--add-opens=java.base/java.lang=ALL-UNNAMED" ^
  "--add-opens=java.base/java.io=ALL-UNNAMED" ^
  "--add-opens=java.base/java.util=ALL-UNNAMED" ^
  "--add-opens=java.base/java.util.stream=ALL-UNNAMED" ^
  "--add-opens=java.base/java.net=ALL-UNNAMED" ^
  %___MVNW_UGLY_FQDN% %*
@IF "%MAVEN_BATCH_PAUSE%"=="on" PAUSE
@IF "%MAVEN_BATCH_ECHO%"=="on" ECHO OFF
