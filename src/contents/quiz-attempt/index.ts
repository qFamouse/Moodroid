import type {PlasmoContentScript} from "plasmo"
import {QuizParser} from "~utils/QuizParser";
import {squeezeText} from "~utils/squeezeText";
import {Question, QuestionType} from "~models/types/Question";

export const config: PlasmoContentScript = {
    matches: ["*://newsdo.vsu.by/mod/quiz/attempt.php*"]
}

// TODO: To separate this logic, it is possible to make a separate class for the database
let fileStructures = `{"dataType":"Map","value":[["какойоператорtransactsqlобеспечиваетбезусловныйвыxодизпроцедуры?",{"text":"Какой оператор Transact SQL обеспечивает безусловный выxод из процедуры?","type":"shortanswer","answers":["return"]}],["вкакойбдхранятсясистемныехранимыепроцедуры?",{"text":"В какой БД хранятся системные хранимые процедуры?","type":"shortanswer","answers":["master"]}],["какиеинструкциивсегдавыполняютсякакотдельныепакеты?",{"text":"Какие инструкции всегда выполняются как отдельные пакеты?","type":"multichoice","answers":["CREATE TRIGGER","CREATE VIEW","CREATE PROCEDURE"]}],["вкакойбдхранятсявременныехранимыепроцедуры?",{"text":"В какой БД хранятся временные хранимые процедуры?","type":"shortanswer","answers":["tempdb"]}],["какиеутверждениянеявляютсяверными?",{"text":"Какие утверждения не являются верными?","type":"multichoice","answers":["Использование хранимых процедур  повышает нагрузку на сеть","Xранимые процедуры  являются частью клиентского приложения","Хранимые процедуры снижают уровень безопасности системы"]}],["записатькомандувызова.процедурысименемproc,передавейвходныепараметры:m=5,n=7.попозиции",{"text":"Записать команду вызова .процедуры с именем PROC, передав ей входные параметры: M =5, N=7.по позиции","type":"shortanswer","answers":["EXEC PROC 5,7"]}],["функция,используемаядляобработкиисключенийвблокеcatch,котораявозвращаетуровеньсерьезностиошибки-это",{"text":"Функция , используемая для обработки исключений в блоке CATCH, которая возвращает уровень серьезности ошибки \\n - это","type":"shortanswer","answers":["ERROR_SEVERITY()"]}],["областьпамяти,используемаядляхраненияскомпилированныхплановвыполненияхранимыхпроцедур-это",{"text":"Область памяти, используемая для хранения скомпилированных планов выполнения хранимых процедур - это","type":"shortanswer","answers":["кэш процедур"]}],["необходимозаписатькомандуприсваиванияпеременнойavsalсреднегозначенияполяsalaryвтаблицеstaff.выберитеправильныеварианты.",{"text":"Необходимо записать команду присваивания переменной AVSAL среднего значения поля SALARY в таблице STAFF.\\nВыберите правильные варианты.","type":"multichoice","answers":["SELECT@AVSAL=Avg(SALARY) FROM STAFF","SET@AVSAL=(SELECT Avg(SALARY) FROM STAFF)"]}],["длязаданиявыходныхпараметровприсозданиихранимойпроцедурыиспользуетсяслужебноеслово",{"text":"Для задания выходных параметров  при создании хранимой процедуры используется служебное слово","type":"shortanswer","answers":["OUTPUT"]}],["какаяинструкцияобеспечиваетвыводпользовательскогосообщенияобошибке?",{"text":"Какая инструкция обеспечивает вывод пользовательского сообщения об ошибке?","type":"shortanswer","answers":["RAISERROR"]}],["какоеключевоесловообеспечиваетперекомпиляциюпроцедурыприкаждомеевыполнении?",{"text":"Какое ключевое слово обеспечивает перекомпиляцию процедуры при каждом ее выполнении?","type":"shortanswer","answers":["RECOMPILE"]}],["какиеоператорынеиспользуютсявtransactsqlдляуправленияпорядкомвыполненияинструкцийпрограммы?",{"text":"Какие операторы не используются в Transact SQL для управления порядком выполнения инструкций программы?","type":"multichoice","answers":["REPEAT ...UNTIL","FOR"]}],["какаясистемнаяпроцедурапозволяетвключитьвбдновоесообщениеобошибке?(параметрыпроцедурынеуказывайте)",{"text":"Какая системная процедура позволяет включить в БД новое сообщение об ошибке? (параметры процедуры не указывайте)","type":"shortanswer","answers":["Sp_addmessage"]}],["какаякомандаслужитдляотправкипакетанасервер?",{"text":"Какая команда служит для отправки пакета на сервер?","type":"shortanswer","answers":["GO"]}],["глобальнаяпеременная,возвращающаяномерошибки-это",{"text":"Глобальная переменная, возвращающая номер ошибки  - это","type":"shortanswer","answers":["@@ERROR"]}],["могутлихранимыепроцедурыиметьвходныеивыходныепараметры(да/нет)?",{"text":"Могут ли хранимые процедуры иметь входные и выходные параметры (да/нет)?","type":"shortanswer","answers":["да"]}],["можнолиинструкциюcreateprocedureобъединятьсдругимиинструкциямиtransact-sqlводномпакете",{"text":"Можно ли инструкцию CREATE PROCEDURE объединять с другими инструкциями Transact-SQL в одном пакете","type":"multichoice","answers":["нет"]}],["ооднострочныйкомментарийотделяетсяотоператорасимволами",{"text":"Ооднострочный комментарий отделяется от оператора  символами","type":"shortanswer","answers":["--"]}],["еслиприкомпиляциипакетавозникласинтаксическаяошибка",{"text":"Если при компиляции пакета возникла синтаксическая ошибка","type":"multichoice","answers":["процесс компиляции останавливается и выводится сообщение об ошибке"]}],["записатькомандупросмотракодахранимойпроцедурыnew_price",{"text":"Записать команду просмотра кода хранимой процедуры NEW_PRICE","type":"shortanswer","answers":["EXEC sp_helptext 'NEW_PRICE'"]}],["какаядирективаопределяетрежим,прикоторомисходныйтекстхранимойпроцедурынесохраняетсявбд?",{"text":"Какая директива определяет режим, при котором исходный текст хранимой процедуры не сохраняется в БД?","type":"shortanswer","answers":["ENCRYPTION"]}],["записатькомандуприсваиванияпеременной@nколичествазаписейтаблицыstudents",{"text":"Записать команду присваивания переменной @N количества записей таблицы STUDENTS","type":"shortanswer","answers":["SELECT @N = COUNT(*) FROM STUDENTS"]}],["cоздатьпроцедуруnew_stipдляувеличениястипендии(stip)втаблицеstudentsв1.5раза,еслиустудентавтаблицеuspнетоценок(mark)ниже9.впроцедурупередаетсяаргументnom_zachтипаvarchar.выберитеправильныеварианты.",{"text":"Cоздать процедуру New_Stip для увеличения стипендии (STIP) в таблице STUDENTS в 1.5раза, если у студента в таблице USP нет оценок (Mark) ниже 9 . В процедуру передается аргумент Nom_Zach типа varchar.\\nВыберите правильные варианты.","type":"multichoice","answers":["CREATE PROCEDURE New_Stip(@Nom_Zach varchar) AS IF NOT EXISTS(SELECT * FROM USP WHERE Nom_Zach = @Nom_Zach AND MARK<9) UPDATE STUDENTS SET STIP = STIP*1.5 WHERE Nom_Zach = @Nom_Zach"," CREATE PROCEDURE New_Stip(@Nom_Zach varchar ) AS IF (SELECT min(оценка) FROM USP WHERE Nom_Zach= @Nom_Zach) >=9 UPDATE STUDENTS SET STIP = STIP*1.5 WHERE Nom_Zach = @Nom_Zach\\n\\n\\n\\n\\n\\n\\n \\n\\n\\n\\n\\n\\n","CREATE PROCEDURE New_Stip(@Nom_Zach varchar) AS IF (SELECT COUNT(*) FROM USP WHERE Nom_Zach = @Nom_Zach AND MARK<9) =0 UPDATE STUDENTS SET STIP = STIP*1.5 WHERE Nom_Zach = @Nom_Zach"]}],["задайтекомандупросмотракодахранимойпроцедурыnew_salary",{"text":"Задайте команду просмотра кода хранимой процедуры New_salary","type":"shortanswer","answers":["EXEC sp_helptext 'New_salary'"]}],["какойоператорtransactsqlпозволяетпрерватьвыполнениециклаивернутьсякзаголовкуцикла?",{"text":"Какой оператор Transact SQL позволяет прервать выполнение цикла и вернуться к заголовку цикла?","type":"shortanswer","answers":["CONTINUE"]}],["какаяглобальнаяпеременнаявозвращаетчислонезавершенныхтранзакций?",{"text":"Какая глобальная переменная  возвращает число незавершенных транзакций?","type":"shortanswer","answers":["@@TRANCOUNT"]}],["какойоператориспользуетсядлясозданияxранимойпроцедуры?",{"text":"Какой оператор используется для создания xранимой процедуры?","type":"shortanswer","answers":["CREATE PROCEDURE"]}],["последнеезначение,помещенноевполе,имеющеетипidentityможетбытьвозвращеноспомощьюглобальнойпеременной",{"text":"Последнее значение, помещенное в поле, имеющее тип IDENTITY может быть возвращено с помощью глобальной  переменной","type":"shortanswer","answers":["@@IDENTITY"]}],["какаякомандаслужитдлязапускапроцедурынавыполнение?",{"text":"Какая команда служит для запуска процедуры на выполнение?","type":"shortanswer","answers":["EXEC"]}],["какаяглобальнаяпеременнаявозвращаетколичествострок,измененныхпоследнимзапросом?",{"text":"Какая глобальная переменная возвращает количество строк, измененных последним запросом?","type":"shortanswer","answers":["@@ROWCOUNT"]}],["набороператоровsql,одновременнопередаваемыхsql–серверуcпомощьюкомандыgo,ивыполняемыхкакединаягруппа-это",{"text":" Набор операторов SQL, одновременно передаваемых SQL –серверу c помощью команды GO, и выполняемых как единая группа - это","type":"shortanswer","answers":["Пакет"]}],["cоздатьхранимуюпроцедуруproc1,возвращающуючерезвыходнойпараметр@cтипаintколичествооценоквтаблицеusp(n_zach,pkod,tnum,udate,mark)полученныхстудентомсномером(n_zach),передаваемомкакпараметр@n_zachтипаvarchar.выберитеправильныйвариант(правильныеварианты)",{"text":"Cоздать хранимую процедуру PROC1, возвращающую через выходной параметр @c типа int количество оценок в таблице USP(N_Zach,PKOD,TNUM,UDATE,MARK) полученных студентом с номером (N_Zach), передаваемом как параметр @N_Zach типа varchar.\\nВыберите правильный вариант (правильные варианты)","type":"multichoice","answers":["CREATE PROC PROC1(@N_Zach varchar,@с int OUTPUT) AS select @с=COUNT(*)FROM usp WHERE N_Zach=@N_Zach"]}],["функция,используемаядляобработкиисключенийвблокеcatch,котораявозвращаетполныйтекстсообщенияобошибке-это",{"text":"Функция , используемая для обработки исключений в блоке CATCH, которая возвращает полный текст сообщения об ошибке - это","type":"shortanswer","answers":["ERROR_MESSAGE()"]}],["набороператоровsql,одновременнопередаваемыхsql–серверукомандойgoивыполняемыхкакединаягруппа-это",{"text":"Набор операторов SQL, одновременно передаваемых SQL–серверу командой GO и выполняемых как единая группа - это","type":"shortanswer","answers":["Пакет"]}],["командадолжназапуститьпроцедурусимениемproc,передавейвходныепараметры:m=5,n=7соссылкойнаименапередаваемыхпараметров,ивыходнойпараметрc.дляпараметраnзаданозначениепоумолчаниюнайдитеошибочныйварианткоманды.",{"text":"Команда должна запустить процедуру с имением PROC, передав ей входные параметры: M =5, N=7 со ссылкой на имена передаваемых параметров, и выходной параметр C. Для параметра N задано значение по умолчанию\\n Найдите ошибочный вариант команды.","type":"multichoice","answers":["EXEC PROC @M=5,@N=7,@C","EXEC PROC @M=5, @C OUTPUT"]}],["какиеутверждениясправедливыдляхранимыхпроцедур?",{"text":"Какие утверждения справедливы для хранимых процедур?\\n \\n ","type":"multichoice","answers":["могут вызываться триггером","выполняются быстрее чем обычный запрос","могут вызываться клиентской программой"]}],["найдитесоответствие:",{"text":"Найдите соответствие:","type":"match","answers":["не допускает использования входных и выходных параметров ","сценарий"," хранится в откомпилированном виде","хранимая процедура","снижает нагрузку на локальную сеть","хранимая процедура","хранится в виде текстового файла ","сценарий","хранится  на сервере ","хранимая процедура"]}],["ошибкисозначениямиуровнейважности1-18являются",{"text":"Ошибки со значениями уровней важности 1-18 являются\\n ","type":"multichoice","answers":["информационными"]}],["объявитьпеременнуюnameтипаnvarcharдлиной10символов",{"text":"Объявить переменную NAME типа NVARCHAR длиной 10 символов","type":"shortanswer","answers":["DECLARE @NAME NVARCHAR(10)"]}],["запишитекомандувызовапроцедурыnew_stipccпередачейпараметраnom_zachравного'2015111'поссылкенаимяпараметра.",{"text":"Запишите команду вызова процедуры New_Stip c  c передачей параметра  Nom_Zach равного  '2015111' по ссылке на имя параметра.","type":"shortanswer","answers":["EXEC New_Stip @Nom_Zach='2015111'"]}],["скакогопрефиксаначинаютсяименасистемныххранимыхпроцедур?",{"text":"С какого  префикса начинаются  имена системных хранимых процедур?","type":"multichoice","answers":["sp_"]}],["записатькомандузапускапроцедурысимениемprocnew,передавейвходныепараметры:z=5,x=7соссылкойнаименапередаваемыхпараметров,ивыходнойпараметрy.",{"text":"Записать команду запуска процедуры с имением PROCNEW, передав ей входные параметры: Z=5, X=7 со ссылкой на имена передаваемых параметров, и выходной параметр Y.","type":"shortanswer","answers":["EXEC PROCNEW @Z=5,@X=7,@Y OUTPUT"]}]]}`
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
let database = JSON.parse(fileStructures, reviver) as Map<string, object>;

window.addEventListener("load", () => {
    let ques = document.querySelectorAll('.que');

    ques.forEach(que => {
        let squeezedQueText = squeezeText(QuizParser.getQuestionText(que));

        let question = database.get(squeezedQueText) as Question;

        if (question != undefined) {
            switch (QuizParser.getQuestionType(que.classList)) {
                case QuestionType.multichoice:
                    let rows = QuizParser.getQuestionRows(que);
                    rows.forEach(row => {
                        console.log(question.answers);
                        question.answers.forEach(answer => {
                            if (squeezeText(QuizParser.getQuestionTextFromRow(row)) == squeezeText(answer)) {
                                // TODO: Tip for multichoice
                                (row.querySelector("input[type=checkbox], input[type=radio]") as HTMLInputElement).checked = true;
                            }
                        })
                    })
                    break;

                case QuestionType.shortanswer:
                case QuestionType.essay:
                    let input = QuizParser.getQuestionInput(que);
                    if (question.answers.length == 1) {
                        // TODO: Tip for written answer
                        input.value = question.answers[0];
                    } else {
                        question.answers.forEach(answer => console.log(answer));
                        throw new Error(`There is more than one answer for one input.`)
                    }
                    break;

                case QuestionType.match:
                    QuizParser.getMatchElements(que).forEach(matchQuestion => {
                        let textIndex = question.answers.indexOf(matchQuestion.text.textContent);
                        matchQuestion.getOptions().forEach(option => {
                            // TODO: Tip for match answer
                            if (squeezeText(option.text) == squeezeText(question.answers[textIndex+1])) {
                                option.selected = true;
                            }
                        })
                    })

                    break;

                default:
                    throw new Error("Unsupported type")
            }
        }
        else {
            console.log("There are no matches on the question")
        }
    })
})


