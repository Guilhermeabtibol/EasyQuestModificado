import { questionType } from '../../Constants';

const multiple = (question) => {
  const { description, alternatives, feedback } = question;
  const alternativesText = alternatives.map((alternative) => {
    const value = alternative.isCorrect ? 100 : 0;
    return `<answer fraction="${value}" format="html">
    <text><![CDATA[${alternative.text}]]></text>
    <feedback format="html">
      <text><![CDATA[<div style="text-align: justify;">${alternative.feedback || ''}</div>]]></text>
    </feedback>
  </answer>`;
  });
  const xml = `
    <question type="multichoice">
      <name>
        <text>${question.title}</text>
      </name>
      <questiontext format="html">
        <text><![CDATA[<div style="text-align: justify;">${description}</div>]]></text>
      </questiontext>
      <generalfeedback format="html">
        <text><![CDATA[<div style="text-align: justify;">${feedback}</div>]]></text>
      </generalfeedback>
      <defaultgrade>1</defaultgrade>
      <penalty>0.3333333</penalty>
      <hidden>0</hidden>
      <idnumber></idnumber>
      <single>true</single>
      <shuffleanswers>true</shuffleanswers>
      <answernumbering>abc</answernumbering>
      <showstandardinstruction>0</showstandardinstruction>
      <correctfeedback format="html">
        <text><![CDATA[<div style="text-align: justify;">Sua resposta está correta.</div>]]></text>
      </correctfeedback>
      <partiallycorrectfeedback format="html">
        <text><![CDATA[<div style="text-align: justify;">Sua resposta está parcialmente correta.</div>]]></text>
      </partiallycorrectfeedback>
      <incorrectfeedback format="html">
        <text><![CDATA[<div style="text-align: justify;">Sua resposta está incorreta.</div>]]></text>
      </incorrectfeedback>
      <shownumcorrect/>
      ${alternativesText.join('\n')}
    </question>
  `;

  return xml;
};

const essay = (question) => `
    <question type="essay">
      <name>
        <text>${question.title}</text>
      </name>
      <questiontext format="html">
        <text><![CDATA[<div style="text-align: justify;">${question.description}</div>]]></text>
      </questiontext>
      <generalfeedback format="html">
        <text><![CDATA[<div style="text-align: justify;">${question.feedback}</div>]]></text>
      </generalfeedback>
      <defaultgrade>1</defaultgrade>
      <penalty>0</penalty>
      <hidden>0</hidden>
      <idnumber></idnumber>
      <responseformat>editor</responseformat>
      <responserequired>1</responserequired>
      <responsefieldlines>15</responsefieldlines>
      <attachments>0</attachments>
      <attachmentsrequired>0</attachmentsrequired>
      <graderinfo format="html">
        <text></text>
      </graderinfo>
      <responsetemplate format="html">
        <text></text>
      </responsetemplate>
    </question>
  `;

const trueFalse = (question) => `
  <question type="truefalse">
    <name>
      <text>${question.title}</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[<div style="text-align: justify;">${question.description}</div>]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[<div style="text-align: justify;">${question.feedback}</div>]]></text>
    </generalfeedback>
    <defaultgrade>1</defaultgrade>
    <penalty>1</penalty>
    <hidden>0 </hidden>
    <idnumber></idnumber>
    <answer fraction="${question.isCorrect ? 100 : 0}" format="moodle_auto_format">
      <text>true</text>
      <feedback format="html">
        <text><![CDATA[<div style="text-align: justify;">${question.trueFeedback || ''}</div>]]></text>
      </feedback>
    </answer>
    <answer fraction="${question.isCorrect ? 0 : 100}" format="moodle_auto_format">
      <text>false</text>
      <feedback format="html">
        <text><![CDATA[<div style="text-align: justify;">${question.falseFeedback || ''}</div>]] </text>
      </feedback>
    </answer>
  </question>`;

const associative = (question) => {
  const { description, items, feedback, title } = question;
  const alternativesText = items.map(
    (item) => `<subquestion format="html">
    <text><![CDATA[${item.text}]]></text>
    <answer>
      <text>${item.answer}</text>
    </answer>
    <feedback format="html">
      <text><![CDATA[<div style="text-align: justify;">${item.feedback || ''}</div>]]></text>
    </feedback>
  </subquestion>`
  );
  const xml = `
  <question type="matching">
    <name>
      <text>${title}</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[<div style="text-align: justify;">${description}</div>]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[<div style="text-align: justify;">${feedback}</div>]]></text>
    </generalfeedback>
    <defaultgrade>1</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <idnumber></idnumber>
    <shuffleanswers>true</shuffleanswers>
    <correctfeedback format="html">
      <text><![CDATA[<div style="text-align: justify;">Sua resposta está correta.</div>]]></text>
    </correctfeedback>
    <partiallycorrectfeedback format="html">
      <text><![CDATA[<div style="text-align: justify;">Sua resposta está parcialmente correta.</div>]]></text>
    </partiallycorrectfeedback>
    <incorrectfeedback format="html">
      <text><![CDATA[<div style="text-align: justify;">Sua resposta está incorreta.</div>]]></text>
    </incorrectfeedback>
    <shownumcorrect/>
      ${alternativesText.join('\n')}
    </question>
  `;

  return xml;
};

const convertByType = (question) => {
  switch (question.type) {
    case questionType.multiple.constant:
      return multiple(question);
    case questionType.descritive.constant:
      return essay(question);
    case questionType.trueFalse.constant:
      return trueFalse(question);
    case questionType.associative.constant:
      return associative(question);
    default:
      throw new Error('Not implemented');
  }
};

export const SingleMoodleXml = (question) =>
  `<?xml version="1.0" encoding="UTF-8"?><quiz>${convertByType(question)}</quiz>`;

export const MultipleMoodleXml = (questions) => {
  const allQuestions = questions.reduce((all, question) => all + convertByType(question), '');
  return `<?xml version="1.0" encoding="UTF-8"?><quiz>${allQuestions}</quiz>`;
};
