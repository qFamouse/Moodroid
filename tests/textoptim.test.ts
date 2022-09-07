import { optim } from "~textoptim";

test("should return null", () => {
  let expected: string = null;

  let actual: string = optim(null);

  expect(actual).toBe(expected);
});

test("should remove whitespaces and lowercase", () => {
  let text: string = "  Simple text.  ";
  let expected: string = "simpletext.";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("should remove html tags, whitespaces and lowercase", () => {
  let text: string = "<a href=\"xxx\">Link ! ! !</a>";
  let expected: string = "link!!!";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("should remove html tags, whitespaces, lowercase and leave arrows", () => {
  let text: string = "<a href=\"xxx\"> --> Link ! ! ! <-- </a>";
  let expected: string = "-->link!!!<--";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("should remove html tags and whitespaces and leave brackets", () => {
  let text: string = "<a href=\"xxx\"> <> </a>";
  let expected: string = "<>";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("should remove nested html tags, whitespaces and lowercase", () => {
  let text: string = "<div>Text <span>red</span>.</div>";
  let expected: string = "textred.";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("should remove nested html tags, whitespaces, lowercase and leave bracket", () => {
  let text: string = "<div>Text <<span>red</span>.</div>";
  let expected: string = "text<red.";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});



test("qtext: should remove html tags, whitespaces and lowercase", () => {
  let text: string = `
    <div class="qtext">
      <p dir="ltr" style="text-align: left;">
        Для хранения всех временных объектов, создаваемых 
        пользователями во время сеанса работы в MS SQL Server , 
        служит база данных
        <br>
        <br>
      </p>
    </div>
  `;
  let expected: string = "дляхранениявсехвременныхобъектов,создаваемыхпользователямивовремясеансаработывmssqlserver,служитбазаданных";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});

test("qtext: should remove html tags, whitespaces and lowercase", () => {
  let text: string = `
    <div class="qtext">
      <p>Даны отношения R1 и R2.</p>
      <p><strong>R1</strong></p>
      <table border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td valign="top" width="163">
              <p>Преподаватель</p>
              <p>&nbsp;</p>
            </td>
            <td valign="top" width="144">
              <p>Группа</p>
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Иванов</p>
            </td>
            <td valign="top" width="144">
              <p>11</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Иванов</p>
            </td>
            <td valign="top" width="144">
              <p>12</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Федоров</p>
            </td>
            <td valign="top" width="144">
              <p>13</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Смирнов</p>
            </td>
            <td valign="top" width="144">
              <p>11</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Федоров</p>
            </td>
            <td valign="top" width="144">
              <p>12</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="163">
              <p>Федоров</p>
            </td>
            <td valign="top" width="144">
              <p>11</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>R2</strong></p>
      <table border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td valign="top" width="139">
              <p>Группа</p>
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="139">
              <p>11</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="139">
              <p>12</p>
            </td>
          </tr>
          <tr>
            <td valign="top" width="139">
              <p>13</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <br>
        Какое значение будет содержать отношение. полученное 
        в результате выполнения: R1 DEVIDE BY R2 ?
      </p>
    </div>
  `;
  let expected: string = "даныотношенияr1иr2.r1преподавательгруппаиванов11иванов12федоров13смирнов11федоров12федоров11r2группа111213какоезначениебудетсодержатьотношение.полученноеврезультатевыполнения:r1devidebyr2?";

  let actual: string = optim(text);

  expect(actual).toBe(expected);
});