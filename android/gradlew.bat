@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Use explicit quotes here after redefining
set "JAVA_EXE_QUOTED="
@rem Attempt to set JAVA_HOME if it's not already set.
if not "%JAVA_HOME%" == "" (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set "JAVA_EXE_QUOTED="%JAVA_HOME%\bin\java.exe""
    )
)
if %JAVA_EXE_QUOTED% == "" (
    set JAVA_EXE=java.exe
    %JAVA_EXE% -version >NUL 2>&1
    if %ERRORLEVEL% neq 0 (
        echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
        echo.
        echo Please set the JAVA_HOME variable in your environment to match the
        echo location of your Java installation.
        goto fail
    )
    set "JAVA_EXE_QUOTED=java.exe"
)


@rem Collect all arguments for the java command, following the shell quoting and substitution rules
set "GRADLE_CMD_LINE_ARGS=%*"
if defined GRADLE_CMD_LINE_ARGS (
    @rem Add the APP_BASE_NAME as the first argument.
    @rem Figuring out the quoting needs for this is maybe the hardest part of this script.
    @rem Read https://ss64.com/nt/syntax-esc.html
    @rem For this to work, the first argument must be the script name without modification.
    set "GRADLE_CMD_LINE_ARGS=%APP_BASE_NAME% %GRADLE_CMD_LINE_ARGS%"
) else (
    set "GRADLE_CMD_LINE_ARGS=%APP_BASE_NAME%"
)

@rem Set the GRADLE_HOME directory if it's not already set.
@rem This matters if this script is linked directly, or is not in the distribution structure.
if not defined GRADLE_HOME (
    set "GRADLE_HOME=%APP_HOME%"
)
if not exist "%GRADLE_HOME%\lib\gradle-launcher.jar" (
    echo Error: GRADLE_HOME is not set to a valid directory.
    echo The script is unable to find the gradle-launcher.jar.
    echo Please set GRADLE_HOME.
    goto fail
)
set "CLASSPATH=%GRADLE_HOME%\lib\gradle-launcher.jar"

@rem Add default JVM options if no JAVA_OPTS or GRADLE_OPTS are set.
if "%JAVA_OPTS%" == "" (
    if "%GRADLE_OPTS%" == "" (
        set GRADLE_OPTS=%DEFAULT_JVM_OPTS%
    )
)

@rem Escape parentheses and percent signs in JAVA_OPTS and GRADLE_OPTS.
@rem Additionally, escape equal signs in JAVA_OPTS. This is necessary when the value of a JVM option contains an equal sign.
@rem For example, when using -Dfoo="bar=baz", the equal sign in "bar=baz" should be escaped.
@rem This seems to be a peculiarity of how Windows handles arguments with equal signs.
if defined JAVA_OPTS (
    set JAVA_OPTS=%JAVA_OPTS:(=^^^(%
    set JAVA_OPTS=%JAVA_OPTS:)=^^^)%
    set JAVA_OPTS=%JAVA_OPTS:%%=%%%%%
    set JAVA_OPTS=%JAVA_OPTS:"=""%
    set JAVA_OPTS=%JAVA_OPTS:^=^^%
    set JAVA_OPTS=%JAVA_OPTS:&=^&%
    set JAVA_OPTS=%JAVA_OPTS:|=^|%
    set JAVA_OPTS=%JAVA_OPTS:<=^<%
    set JAVA_OPTS=%JAVA_OPTS:>=^>%
    set JAVA_OPTS=%JAVA_OPTS:;=^;%
    set JAVA_OPTS=%JAVA_OPTS:,=^,%
    set JAVA_OPTS=%JAVA_OPTS: = %
    @rem Remove surrounding quotes if any, they are not required for JAVA_OPTS
    if defined JAVA_OPTS if "%JAVA_OPTS:~0,1%"=="""" set "JAVA_OPTS=%JAVA_OPTS:~1,-1%"
)
if defined GRADLE_OPTS (
    set GRADLE_OPTS=%GRADLE_OPTS:(=^^^(%
    set GRADLE_OPTS=%GRADLE_OPTS:)=^^^)%
    set GRADLE_OPTS=%GRADLE_OPTS:%%=%%%%%
)

@rem Execute Gradle
%JAVA_EXE_QUOTED% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.launcher.GradleMain %GRADLE_CMD_LINE_ARGS%

:fail
@rem Exit code for the script itself.
set ERRORLEVEL=1
goto end

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:failEnd
@echo.
@echo GRADLE_OPTS is %GRADLE_OPTS%
@echo JAVA_OPTS is %JAVA_OPTS%
@echo CLASSPATH is %CLASSPATH%
@echo JAVA_HOME is %JAVA_HOME%
@echo DIRNAME is %DIRNAME%
@echo.
@echo For more information on how to set up your Java environment visit:
@echo https://docs.gradle.org/current/userguide/installation.html#configuring_jvm_memory
@echo.

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
