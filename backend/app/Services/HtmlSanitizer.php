<?php

declare(strict_types=1);

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer as SymfonyHtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class HtmlSanitizer
{
    private SymfonyHtmlSanitizer $sanitizer;

    public function __construct()
    {
        $config = (new HtmlSanitizerConfig)
            ->allowElement('p')
            ->allowElement('br')
            ->allowElement('strong')
            ->allowElement('em')
            ->allowElement('h2')
            ->allowElement('h3')
            ->allowElement('h4')
            ->allowElement('ul')
            ->allowElement('ol')
            ->allowElement('li')
            ->allowElement('blockquote')
            ->allowElement('a', ['href'])
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->allowRelativeLinks(true)
            ->forceAttribute('a', 'rel', 'noopener noreferrer')
            ->allowElement('img', ['src', 'alt'])
            ->allowRelativeMedias(true)
            ->allowMediaSchemes(['https']);

        $this->sanitizer = new SymfonyHtmlSanitizer($config);
    }

    public function clean(string $html): string
    {
        return $this->sanitizer->sanitize($html);
    }
}
